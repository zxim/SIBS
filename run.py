import json
import numpy as np
import re
import glob
import pickle
import random
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.optimizers.schedules import ExponentialDecay
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils import class_weight

# 파일 경로 설정
file_patterns = ['./train/talksets-train-*.json']
repeat_file_paths = ['./train/talksets-train-7.json']
checkpoint_path = './checkpoint/saved_model.keras'  # 기존 경로
tokenizer_path = './checkpoint/tokenizer.pickle'    # 기존 경로

# 하이퍼파라미터 설정
max_features = 15000
maxlen = 150
embedding_dim = 200
epochs = 20
batch_size = 32

# 초성 변환 함수
def to_chosung(text):
    chosung_list = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 
        'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ]
    base_code, chosung_base, jongseong_base = 44032, 588, 28

    result = []
    for char in text:
        if '가' <= char <= '힣':
            char_code = ord(char) - base_code
            chosung_index = char_code // chosung_base
            result.append(chosung_list[chosung_index])
        else:
            result.append(char)
    return ''.join(result)

# 비속어 모델 생성 함수
def create_badword_model(file_patterns, repeat_file_paths):
    badword_model = {}
    
    # 일반 파일에서 비속어 추출
    for pattern in file_patterns:
        for file_path in glob.glob(pattern):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            for item in data:
                for sentence_info in item['sentences']:
                    if "CENSURE" in sentence_info['types']:
                        origin_text = sentence_info['origin_text']
                        chosung_text = to_chosung(origin_text)
                        if origin_text not in badword_model:
                            badword_model[origin_text] = []
                        if chosung_text not in badword_model[origin_text]:
                            badword_model[origin_text].append(chosung_text)
    
    # 반복 파일에서 비속어 추출
    for file_path in repeat_file_paths:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            for sentence_info in item['sentences']:
                if "CENSURE" in sentence_info['types']:
                    origin_text = sentence_info['origin_text']
                    chosung_text = to_chosung(origin_text)
                    if origin_text not in badword_model:
                        badword_model[origin_text] = []
                    if chosung_text not in badword_model[origin_text]:
                        badword_model[origin_text].append(chosung_text)

    return badword_model

# 텍스트 전처리 함수
def preprocess_text(text, badword_model):
    # 숫자 -> 한글 치환
    number_to_korean = {'0': '영', '1': '일', '2': '이', '3': '삼', '4': '사', '5': '오', 
                        '6': '육', '7': '칠', '8': '팔', '9': '구'}
    text = ''.join([number_to_korean.get(char, char) for char in text])
    
    # 특수문자를 일반 문자로 치환 (예: '@' -> 'a', '!' -> 'i')
    text = text.replace('@', 'ㅇ').replace('!', 'i').replace('1', 'ㅣ').replace('^', 'ㅅ').replace('1', '일')

    # 초성 변환
    chosung_text = to_chosung(text)
    
    # 띄어쓰기 제거
    text_without_spaces = text.replace(" ", "")
    
    # n-gram 생성 (3-gram과 4-gram)
    ngrams = []
    for n in [3, 4]:
        ngrams.extend([text_without_spaces[i:i+n] for i in range(len(text_without_spaces)-n+1)])
    
    return " ".join([text.strip(), text_without_spaces, chosung_text, *ngrams])

# 데이터 증강 함수
def augment_data(text, badword_model):
    augmented = [text]
    
    # 띄어쓰기 제거 버전 추가
    augmented.append(text.replace(" ", ""))
    
    # 랜덤 특수 문자 삽입
    special_chars = ['@', '#', '$', '%', '^', '&', '*', '1']
    for _ in range(3):
        index = random.randint(0, len(text) - 1)
        char = random.choice(special_chars)
        new_text = text[:index] + char + text[index:]
        augmented.append(new_text)
    
    # 비속어 변형 추가
    for badword in badword_model:
        if badword in text:
            for variant in badword_model[badword]:
                augmented.append(text.replace(badword, variant))
    
    return augmented

# 데이터 불러오기 및 전처리 함수
def load_data(file_patterns, repeat_file_paths, repeat_count, badword_model):
    labeled_sentences = []
    
    # 일반 파일 로드
    for pattern in file_patterns:
        for file_path in glob.glob(pattern):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            for item in data:
                for sentence_info in item['sentences']:
                    origin_text = preprocess_text(sentence_info['origin_text'], badword_model)
                    if "CENSURE" in sentence_info['types']:
                        for aug_text in augment_data(origin_text, badword_model):
                            labeled_sentences.append((aug_text, 1))
                    else:
                        labeled_sentences.append((origin_text, 0))
    
    # 반복 파일 로드
    for _ in range(repeat_count):
        with open(repeat_file_paths[0], 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            for sentence_info in item['sentences']:
                origin_text = preprocess_text(sentence_info['origin_text'], badword_model)
                if "CENSURE" in sentence_info['types']:
                    for aug_text in augment_data(origin_text, badword_model):
                        labeled_sentences.append((aug_text, 1))
                else:
                    labeled_sentences.append((origin_text, 0))
    
    return labeled_sentences

# 모델 생성 함수
def create_model():
    model = Sequential([
        Embedding(max_features, embedding_dim),
        Conv1D(128, 3, activation='relu', padding='same'),
        Conv1D(128, 4, activation='relu', padding='same'),
        Conv1D(128, 5, activation='relu', padding='same'),
        GlobalMaxPooling1D(),
        Dense(128, activation='relu'),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    
    initial_learning_rate = 0.001
    lr_schedule = ExponentialDecay(
        initial_learning_rate,
        decay_steps=10000,
        decay_rate=0.9,
        staircase=True)
    
    optimizer = Adam(learning_rate=lr_schedule)
    model.compile(optimizer=optimizer, loss='binary_crossentropy', metrics=['accuracy'])
    return model

# 모델 학습 및 평가 함수
def train_and_evaluate_model(file_patterns, repeat_file_paths, repeat_count):
    badword_model = create_badword_model(file_patterns, repeat_file_paths)  # 비속어 모델 생성
    
    labeled_data = load_data(file_patterns, repeat_file_paths, repeat_count, badword_model)
    
    texts = []
    labels = []
    for text, label in labeled_data:
        texts.append(text)
        labels.append(label)

    tokenizer = Tokenizer(num_words=max_features)
    tokenizer.fit_on_texts(texts)
    sequences = tokenizer.texts_to_sequences(texts)
    data = pad_sequences(sequences, maxlen=maxlen)
    labels = np.asarray(labels)

    X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42)

    class_weights = class_weight.compute_class_weight(class_weight='balanced', classes=np.unique(y_train), y=y_train)
    class_weights = dict(enumerate(class_weights))

    model = create_model()
    
    checkpoint_callback = ModelCheckpoint(checkpoint_path, 
                                           save_best_only=True, 
                                           mode='max', 
                                           monitor='val_loss', 
                                           verbose=1, 
                                           save_weights_only=False)
    
    history = model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[checkpoint_callback], class_weight=class_weights)

    with open(tokenizer_path, 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

    y_pred = model.predict(X_test)
    y_pred_classes = (y_pred > 0.5).astype(int)

    print("분류 보고서:")
    print(classification_report(y_test, y_pred_classes))
    print("\n혼동 행렬:")
    print(confusion_matrix(y_test, y_pred_classes))

    return model, tokenizer

if __name__ == '__main__':
    best_model, tokenizer = train_and_evaluate_model(file_patterns, repeat_file_paths, repeat_count=30)
    print("모델 학습 및 평가가 완료되었습니다.")
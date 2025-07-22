# Stalk Backend

Stalk 투자 플랫폼 백엔드 서버

## 기술 스택

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **JWT 인증**
- **Maven**

## 주요 기능

### 인증 (Authentication)
- 회원가입 (일반 사용자 / 전문가)
- 로그인 / 로그아웃
- JWT 토큰 기반 인증
- 이메일 인증

### 사용자 관리
- 사용자 프로필 관리
- 파일 업로드 (프로필 사진, 자격증 파일)
- 아이디/닉네임 중복 검사

## API 엔드포인트

### 인증 API (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | 회원가입 |
| POST | `/login` | 로그인 |
| GET | `/check-userid/{userId}` | 아이디 중복 검사 |
| GET | `/check-nickname/{nickname}` | 닉네임 중복 검사 |
| POST | `/send-email-verification` | 이메일 인증 코드 발송 |
| POST | `/verify-email` | 이메일 인증 |

## 프로젝트 구조

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── stalk/
│   │           ├── StalkApplication.java
│   │           ├── config/
│   │           │   └── SecurityConfig.java
│   │           ├── controller/
│   │           │   └── AuthController.java
│   │           ├── dto/
│   │           │   ├── AuthResponse.java
│   │           │   ├── LoginRequest.java
│   │           │   ├── SignupRequest.java
│   │           │   └── UserResponse.java
│   │           ├── entity/
│   │           │   └── User.java
│   │           ├── repository/
│   │           │   └── UserRepository.java
│   │           ├── security/
│   │           │   ├── JwtAuthenticationEntryPoint.java
│   │           │   ├── JwtAuthenticationFilter.java
│   │           │   └── JwtTokenProvider.java
│   │           ├── service/
│   │           │   ├── AuthService.java
│   │           │   ├── EmailService.java
│   │           │   ├── FileStorageService.java
│   │           │   └── UserDetailsServiceImpl.java
│   │           └── util/
│   └── resources/
│       └── application.yml
└── test/
    └── java/
        └── com/
            └── stalk/
```

## 환경 설정

### 필수 환경 변수

```bash
# 데이터베이스
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# 메일 서비스
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# JWT
JWT_SECRET=your_jwt_secret_key
```

### 데이터베이스 설정

1. MySQL 8.0 설치
2. 데이터베이스 생성:
```sql
CREATE DATABASE stalk_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 실행 방법

### 1. Maven을 이용한 실행

```bash
# 의존성 설치
mvn clean install

# 애플리케이션 실행
mvn spring-boot:run
```

### 2. JAR 파일 실행

```bash
# JAR 파일 빌드
mvn clean package

# JAR 파일 실행
java -jar target/stalk-backend-0.0.1-SNAPSHOT.jar
```

## 서버 정보

- **포트**: 8080
- **컨텍스트 패스**: `/api`
- **베이스 URL**: `http://localhost:8080/api`

## 보안

- CORS 설정: 프론트엔드 (http://localhost:3000) 허용
- JWT 토큰 만료 시간: 24시간
- 비밀번호 암호화: BCrypt

## 파일 업로드

- 업로드 디렉토리: `uploads/`
- 최대 파일 크기: 10MB
- 지원 파일 타입: 모든 타입 (프로필 사진, 자격증 파일) 
CREATE TABLE `user_social` (
    `user_social_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
    `user_id` INT UNSIGNED DEFAULT NULL COMMENT 'user FK',
    `social_type` VARCHAR(20) NOT NULL COMMENT 'google: 구글, kakao: 카카오',
    `social_key` VARCHAR(128) NOT NULL COMMENT '소셜 로그인 key (id)',
    `social_status` VARCHAR(20) NOT NULL DEFAULT 'normal' COMMENT 'normal:정상, block:금지',
    `payload` VARCHAR(20480) DEFAULT NULL COMMENT '소셜 로그인 payload 저장',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    PRIMARY KEY (`user_social_id`),
    UNIQUE KEY social (`social_type`, `social_key`),
    KEY FK_user_id (`user_id`),
    CONSTRAINT FK_user_id FOREIGN KEY (`user_id`) REFERENCES user (`user_id`),
    KEY idx_created_at(`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '회원 - 소셜로그인 정보';

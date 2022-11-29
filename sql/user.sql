CREATE TABLE `user` (
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
    `nickname` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '닉네임',
    `user_status` VARCHAR(20) NOT NULL DEFAULT 'normal' COMMENT 'normal:정상, withdraw:탈퇴, block:금지, dormant:휴면',
    `user_level` TINYINT NOT NULL DEFAULT 1 COMMENT '100:슈퍼어드민, 90:어드민, 1:일반유저',
    `email` VARCHAR(256) DEFAULT NULL COMMENT 'email',
    `password` VARCHAR(256) DEFAULT NULL COMMENT 'password',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '회원 가입일',
    `modified_at` DATETIME DEFAULT NULL COMMENT '탈퇴/금지/휴면 처리시 업데이트 처리',
    PRIMARY KEY (`user_id`),
    KEY idx_user_status(`user_status`),
    KEY idx_created_at(`created_at`),
    KEY idx_modified_at(`modified_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '회원';
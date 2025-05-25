
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `visibility` tinyint DEFAULT '0',
  `user` int DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `header` varchar(255) DEFAULT NULL,
  `description` text,
  `keywords` text,
  `page` text,
  `pre_content` varchar(255) DEFAULT NULL,
  `pre_image` varchar(255) DEFAULT NULL,
  `content` text,
  `content_json` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_infos`
--

CREATE TABLE `contact_infos` (
  `id` int NOT NULL,
  `country` varchar(98) DEFAULT NULL,
  `city` varchar(98) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `user_agent` varchar(1000) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `contact_infos`
--

INSERT INTO `contact_infos` (`id`, `country`, `city`, `ip`, `user_agent`) VALUES
(2, 'Türkiye', '', '88.248.12.68', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

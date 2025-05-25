
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `application_infos`
--

CREATE TABLE `application_infos` (
  `application_id` int NOT NULL,
  `country` varchar(98) DEFAULT NULL,
  `city` varchar(98) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

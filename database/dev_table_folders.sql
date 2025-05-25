
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `folders`
--

CREATE TABLE `folders` (
  `id` int NOT NULL,
  `name` varchar(500) NOT NULL,
  `type` smallint NOT NULL,
  `language` smallint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `folders`
--

INSERT INTO `folders` (`id`, `name`, `type`, `language`) VALUES
(1, 'policy', 5, 1);

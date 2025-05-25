
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `writers`
--

CREATE TABLE `writers` (
  `id` int NOT NULL,
  `page` varchar(255) NOT NULL,
  `keywords` varchar(1000) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `instagram` varchar(1000) NOT NULL,
  `linkedin` varchar(1000) NOT NULL,
  `youtube` varchar(1000) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `writers`
--

INSERT INTO `writers` (`id`, `page`, `keywords`, `description`, `instagram`, `linkedin`, `youtube`, `created_at`) VALUES
(3, 'writer-a', 'writer', 'writer', 'writer', 'writer', 'writer', '2024-09-15 02:19:35');

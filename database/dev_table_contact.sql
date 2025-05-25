
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `contact`
--

INSERT INTO `contact` (`id`, `fullname`, `email`, `phone`, `message`, `created_at`) VALUES
(2, 'asd', 'asd', 'asd', 'asd', '2024-09-15 02:53:33');

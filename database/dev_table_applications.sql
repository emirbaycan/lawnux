
-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `field` tinyint DEFAULT NULL,
  `cover_letter` text,
  `cv` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Tablo döküm verisi `applications`
--

INSERT INTO `applications` (`id`, `fullname`, `email`, `phone`, `field`, `cover_letter`, `cv`, `created_at`) VALUES
(1, 'test', 'test', 'test', 2, 'test', '/cvs/atgtu4jhni5ffumk4jb49ad2rc1726369004.pdf', '2024-09-15 02:56:45');

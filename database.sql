SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `restaurant_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `fooditems`
--

CREATE TABLE `fooditems` (
  `id` int(11) NOT NULL,
  `u_name` varchar(50) DEFAULT NULL,
  `price` int(13) DEFAULT NULL,
  `picture` varchar(500) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `fooditems`
--

INSERT INTO `fooditems` (`id`, `u_name`, `price`, `picture`) VALUES
(1, 'Kadai Paneer', 200, 'https://www.whiskaffair.com/wp-content/uploads/2020/08/Kadai-Paneer-2-3.jpg'),
(3, 'kadai chicken', 180, 'https://www.whiskaffair.com/wp-content/uploads/2020/04/Kadai-Chicken-3.jpg'),
(4, 'Veg Steamed Momos', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9XAU8gmJf4VOTZebE83v2Aq_l7b3_7JGCog&usqp=CAU'),
(2, 'palak Paneer', 210, 'https://healthynibblesandbits.com/wp-content/uploads/2020/01/Saag-Paneer-FF.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `mobile` varchar(13) DEFAULT NULL,
  `table_no` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dummy data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `mobile`, `table_no`) VALUES
(1, 'Vikas Kukreti', '8445088973', 25),
(2, 'Tester', '123', 21),
(5, 'gumnaam', '8958973061', 1);

--
-- Indexes for tables
--

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;
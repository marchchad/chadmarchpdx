CREATE USER IF NOT EXISTS 'ipaapi'@'localhost' IDENTIFIED BY 'ipaapi';
CREATE DATABASE  IF NOT EXISTS `ipaapi` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ipaapi`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: ipaapi
-- ------------------------------------------------------
-- Server version	5.5.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brew_session`
--

DROP TABLE IF EXISTS `brew_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brew_session` (
  `sessionid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `recipeid` mediumint(9) DEFAULT NULL,
  `brewedby` varchar(75) DEFAULT NULL,
  `brewedon` date DEFAULT NULL,
  `notes` varchar(1500) DEFAULT NULL,
  PRIMARY KEY (`sessionid`),
  UNIQUE KEY `sessionid_UNIQUE` (`sessionid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Lookup and log info about recipes brewed.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grains`
--

DROP TABLE IF EXISTS `grains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grains` (
  `grainid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `lovibond` decimal(4,1) DEFAULT NULL,
  `producer` varchar(100) DEFAULT NULL,
  `notes` varchar(1500) DEFAULT NULL,
  `origin` varchar(50) DEFAULT NULL,
  `potentialgravity` decimal(4,3) DEFAULT NULL,
  PRIMARY KEY (`grainid`),
  UNIQUE KEY `grainid_UNIQUE` (`grainid`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hop_use`
--

DROP TABLE IF EXISTS `hop_use`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hop_use` (
  `hopuseid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `use` varchar(45) NOT NULL,
  PRIMARY KEY (`hopuseid`),
  UNIQUE KEY `hopuseid_UNIQUE` (`hopuseid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hops`
--

DROP TABLE IF EXISTS `hops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hops` (
  `hopid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `producer` varchar(100) DEFAULT NULL,
  `alphaacid` decimal(4,2) DEFAULT NULL,
  `betaacid` decimal(4,2) DEFAULT NULL,
  `notes` varchar(1500) DEFAULT NULL,
  `origin` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`hopid`),
  UNIQUE KEY `grainid_UNIQUE` (`hopid`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `keg_info`
--

DROP TABLE IF EXISTS `keg_info`;
/*!50001 DROP VIEW IF EXISTS `keg_info`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `keg_info` AS SELECT 
 1 AS `pressure`,
 1 AS `keggedon`,
 1 AS `volume`,
 1 AS `remainingvolume`,
 1 AS `consumedvolume`,
 1 AS `pourcount`,
 1 AS `averagepour`,
 1 AS `maxpour`,
 1 AS `minpour`,
 1 AS `lastpour`,
 1 AS `maxtemp`,
 1 AS `mintemp`,
 1 AS `averagetemp`,
 1 AS `recipeid`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `kegs`
--

DROP TABLE IF EXISTS `kegs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kegs` (
  `kegsessionid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `kegid` mediumint(9) DEFAULT NULL,
  `volume` decimal(6,2) DEFAULT NULL,
  `pressure` decimal(4,2) DEFAULT NULL,
  `keggedon` date DEFAULT NULL,
  `recipeid` mediumint(9) DEFAULT NULL,
  `active` bit(1) NOT NULL DEFAULT b'0',
  `notes` varchar(1500) DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  PRIMARY KEY (`kegsessionid`),
  UNIQUE KEY `sessionid_UNIQUE` (`kegsessionid`),
  KEY `recipeid_idx` (`recipeid`),
  CONSTRAINT `recipeid` FOREIGN KEY (`recipeid`) REFERENCES `recipes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='Stores info about active and historical kegs.\nVolume column is designed for storage as gallons, liters, or quarts. Ounces is a bit too fine of detail.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pours`
--

DROP TABLE IF EXISTS `pours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pours` (
  `pourid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `kegid` mediumint(9) DEFAULT NULL,
  `volume` decimal(6,2) DEFAULT NULL,
  `pourstart` datetime DEFAULT NULL,
  `pourend` datetime DEFAULT NULL,
  `temperature` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`pourid`),
  UNIQUE KEY `pourid_UNIQUE` (`pourid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipe_grains`
--

DROP TABLE IF EXISTS `recipe_grains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe_grains` (
  `recipeid` mediumint(9) NOT NULL,
  `grainid` mediumint(9) NOT NULL,
  `amount` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Lookup table to link multiple grains to a recipe';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipe_hops`
--

DROP TABLE IF EXISTS `recipe_hops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe_hops` (
  `recipeid` mediumint(9) NOT NULL,
  `hopid` mediumint(9) NOT NULL,
  `amount` decimal(4,2) DEFAULT NULL,
  `use` mediumint(9) DEFAULT NULL,
  `time` mediumint(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Lookup table to link multiple grains to a recipe';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipe_yeast`
--

DROP TABLE IF EXISTS `recipe_yeast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe_yeast` (
  `recipeid` mediumint(9) NOT NULL,
  `yeastid` mediumint(9) NOT NULL,
  PRIMARY KEY (`recipeid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipes` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) NOT NULL,
  `og` decimal(4,3) DEFAULT NULL,
  `fg` decimal(4,3) DEFAULT NULL,
  `abv` decimal(4,2) DEFAULT NULL,
  `Author` varchar(75) DEFAULT NULL,
  `Notes` varchar(1500) DEFAULT NULL,
  `srm` decimal(3,1) DEFAULT NULL,
  `ibu` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='Recipes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(45) DEFAULT 'user',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `idusers_UNIQUE` (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `yeast`
--

DROP TABLE IF EXISTS `yeast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `yeast` (
  `yeastid` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `lab` varchar(100) DEFAULT NULL,
  `form` varchar(10) DEFAULT NULL,
  `temperature` varchar(15) DEFAULT NULL,
  `flocculation` varchar(20) DEFAULT NULL,
  `notes` varchar(1500) DEFAULT NULL,
  `beertype` varchar(25) DEFAULT NULL,
  `attenuation` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`yeastid`),
  UNIQUE KEY `yeastid_UNIQUE` (`yeastid`)
) ENGINE=InnoDB AUTO_INCREMENT=872 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'ipaapi'
--
/*!50003 DROP FUNCTION IF EXISTS `est_keg_blow_date` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `est_keg_blow_date`(kegid INT) RETURNS date
BEGIN
	declare keggedon DATETIME;
    declare blowdate DATE;
    declare today DATE;
    declare consumedVolume Float(4,2);
    declare remainingVolume Float(4,2);
    declare totalPours Int;
    declare avgPourPerDay Float(4,2);
    declare remainingDays Float(5,2);
    
    set today = CURDATE();
    
	select
		cast(k.keggedon as DateTime),
		coalesce(round(k.volume - sum(p.volume / 128), 2), k.volume),
		coalesce(round(sum(p.volume / 128), 2), 0),
		count(p.pourid) as 'pourcount'
	into
		keggedon,
        remainingVolume,
        consumedVolume,
        totalPours
	from kegs k
	left join pours p on k.kegid = p.kegid
    where k.kegid = kegid;
    
    -- get average pour per day
    set avgPourPerDay = (consumedVolume / datediff(today, keggedon));
    -- extrapolate remaining days based on remaining volume and average pour per day
    set remainingDays = remainingVolume / avgPourPerDay;
    -- derive project blow date
    set blowdate = date_add(today, INTERVAL remainingDays day);
    
	RETURN blowdate;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_admin_data` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`ipaapi`@`localhost` PROCEDURE `get_admin_data`()
BEGIN
	select id, Name as name from recipes;
    select k.kegsessionid, k.kegid from kegs k;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_keg_info` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_keg_info`(
	kegid int
)
BEGIN
	select
		k.pressure,
		cast(k.keggedon as DateTime) as 'keggedon',
		round(k.volume, 2) as 'volume',
		concat(coalesce(round(k.volume - sum(p.volume / 128), 2), k.volume), ' gal') as 'remainingvolume',
		concat(coalesce(round(sum(p.volume / 128), 2), 0), ' gal') as 'consumedvolume',
		count(p.pourid) as 'pourcount',
		concat(coalesce(round(sum(p.volume) / count(p.pourid)), 0), ' .oz') as 'averagepour',
		concat(coalesce(max(p.volume), 0), ' .oz') as 'maxpour',
		concat(coalesce(min(p.volume), 0), ' .oz') as 'minpour',
		cast(max(p.pourend) as DateTime) as 'lastpour',
		concat(coalesce(max(p.temperature), '-'), '&deg;') as 'maxtemp',
		concat(coalesce(min(p.temperature), '-'), '&deg;') as 'mintemp',
		concat(coalesce(round(sum(p.temperature) / count(p.pourid)), 1), '&deg;') as 'averagetemp',
        k.recipeid,
        r.Name as 'recipename',
        est_keg_blow_date(kegid) as 'estimatedblowdate',
        k.finished as 'finisheddate'
	from kegs k
	left join pours p on k.kegid = p.kegid
    left join recipes r on k.recipeid = r.id
    where k.kegid = kegid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_recipes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`ipaapi`@`localhost` PROCEDURE `get_recipes`()
begin
	select r.*,
		k.kegid as keg,
		group_concat(distinct concat(g.name, ',', g.lovibond, ',', 'lovibond', ',', rg.amount) separator '|') as grains,
		group_concat(distinct concat(h.name, ',', rh.amount, ',', hu.`use`, ',', rh.time) separator '|' ) as hops,
		concat(y.lab, ' - ', y.name) as yeast
	from recipes r
	left join recipe_grains rg on r.id = rg.recipeid
	left join grains g on rg.grainid = g.grainid
	left join recipe_hops rh on r.id = rh.recipeid
	left join hops h on rh.hopid = h.hopid
	left join hop_use hu on rh.`use` = hu.hopuseid
	left join recipe_yeast ry on r.id = ry.recipeid
	left join yeast y on ry.yeastid = y.yeastid
	left join kegs k on r.id = k.recipeid
	group by r.id
	order by keg;
    
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_users`()
BEGIN
	SELECT
		userid,
		username,
		email,
		role
	FROM ipaapi.users;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `keg_info`
--

/*!50001 DROP VIEW IF EXISTS `keg_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`ipaapi`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `keg_info` AS select `k`.`pressure` AS `pressure`,cast(`k`.`keggedon` as date) AS `keggedon`,round(`k`.`volume`,2) AS `volume`,concat(coalesce(round((`k`.`volume` - sum((`p`.`volume` / 128))),2),`k`.`volume`),' gal') AS `remainingvolume`,concat(coalesce(round(sum((`p`.`volume` / 128)),2),0),' gal') AS `consumedvolume`,count(`p`.`pourid`) AS `pourcount`,concat(coalesce(round((sum(`p`.`volume`) / count(`p`.`pourid`)),0),0),' .oz') AS `averagepour`,concat(coalesce(max(`p`.`volume`),0),' .oz') AS `maxpour`,concat(coalesce(min(`p`.`volume`),0),' .oz') AS `minpour`,cast(max(`p`.`pourend`) as date) AS `lastpour`,concat(coalesce(max(`p`.`temperature`),'-'),'&deg;') AS `maxtemp`,concat(coalesce(min(`p`.`temperature`),'-'),'&deg;') AS `mintemp`,concat(coalesce(round((sum(`p`.`temperature`) / count(`p`.`pourid`)),0),1),'&deg;') AS `averagetemp`,`k`.`recipeid` AS `recipeid` from (`kegs` `k` left join `pours` `p` on((`k`.`kegid` = `p`.`kegid`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-25 16:07:31
GRANT ALL ON `ipaapi`.* TO 'ipaapi'@'localhost' IDENTIFIED BY 'ipaapi';users
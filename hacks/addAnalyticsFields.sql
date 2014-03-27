ALTER TABLE `Sites`
ADD `AnalyticsSubdomain` TINYINT NOT NULL DEFAULT '0',
ADD `AnalyticsMultidomain` TINYINT NOT NULL DEFAULT '0',
ADD `AnalyticsDomain` VARCHAR( 240 ) NULL;

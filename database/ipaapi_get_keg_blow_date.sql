use ipaapi;
DELIMITER $
DROP FUNCTION IF EXISTS `est_keg_blow_date` $
CREATE FUNCTION `est_keg_blow_date` (kegid INT)
RETURNS DATE
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
END;
$
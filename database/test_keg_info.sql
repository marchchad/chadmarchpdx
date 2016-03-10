use ipaapi;
DELIMITER $
DROP PROCEDURE IF EXISTS get_keg_info $
CREATE PROCEDURE get_keg_info(
	kegid int
)
BEGIN
	declare blowdate DATE;
    set @blowdate = est_keg_blow_date(kegid);
    
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
        @blowdate as 'estimatedblowdate',
        k.finished as 'finisheddate'
	from kegs k
	left join pours p on k.kegid = p.kegid
    left join recipes r on k.recipeid = r.id
    where k.kegid = kegid;
END $
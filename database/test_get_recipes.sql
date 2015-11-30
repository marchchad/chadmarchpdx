use test;

delimiter $$

drop procedure if exists `get_recipes` $$

create definer=`root`@`localhost` procedure `get_recipes`()
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
    
end $$

delimiter ;
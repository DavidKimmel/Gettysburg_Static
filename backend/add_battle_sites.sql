-- Clear existing battle sites
DELETE FROM battle_sites;

-- Insert Real Battle Sites from the Battle of Gettysburg (July 1-3, 1863)

-- Day 1: July 1, 1863
INSERT INTO battle_sites (name, battle_date, description, casualties, geom) VALUES
('McPherson Ridge', '1863-07-01', 
 'Site of the opening engagement of the battle. Union cavalry under John Buford delayed Confederate advance, buying time for Union infantry to arrive.',
 3500,
 ST_GeomFromText('POLYGON((-77.2450 39.8380, -77.2350 39.8380, -77.2350 39.8320, -77.2450 39.8320, -77.2450 39.8380))', 4326)),

('Oak Ridge', '1863-07-01',
 'Union forces under Maj. Gen. Oliver O. Howard made a stand here before being pushed back through town. Site of fierce fighting on Day 1.',
 2800,
 ST_GeomFromText('POLYGON((-77.2420 39.8350, -77.2340 39.8350, -77.2340 39.8280, -77.2420 39.8280, -77.2420 39.8350))', 4326)),

('Seminary Ridge', '1863-07-01',
 'Final Union defensive line on Day 1 before retreating through Gettysburg. Named for the Lutheran Theological Seminary located here.',
 1500,
 ST_GeomFromText('POLYGON((-77.2480 39.8300, -77.2380 39.8300, -77.2380 39.8150, -77.2480 39.8150, -77.2480 39.8300))', 4326));

-- Day 2: July 2, 1863
INSERT INTO battle_sites (name, battle_date, description, casualties, geom) VALUES
('Little Round Top', '1863-07-02',
 'Critical Union defensive position. The 20th Maine Infantry under Col. Joshua Chamberlain held the Union left flank in desperate fighting, including a famous bayonet charge.',
 1750,
 ST_GeomFromText('POLYGON((-77.2385 39.7955, -77.2360 39.7955, -77.2360 39.7935, -77.2385 39.7935, -77.2385 39.7955))', 4326)),

('Devil''s Den', '1863-07-02',
 'Rocky area at the base of Big Round Top. Scene of intense fighting between Union sharpshooters and Confederate forces attempting to flank the Union line.',
 1200,
 ST_GeomFromText('POLYGON((-77.2395 39.7910, -77.2370 39.7910, -77.2370 39.7890, -77.2395 39.7890, -77.2395 39.7910))', 4326)),

('The Wheatfield', '1863-07-02',
 'Changed hands six times during intense fighting on July 2. Over 4,000 casualties in this small field, one of the bloodiest areas of the battle.',
 4200,
 ST_GeomFromText('POLYGON((-77.2345 39.7985, -77.2310 39.7985, -77.2310 39.7960, -77.2345 39.7960, -77.2345 39.7985))', 4326)),

('The Peach Orchard', '1863-07-02',
 'Salient (forward position) of Union line under Gen. Dan Sickles. Overrun by Confederate forces in afternoon fighting on July 2.',
 3100,
 ST_GeomFromText('POLYGON((-77.2380 39.8030, -77.2340 39.8030, -77.2340 39.8000, -77.2380 39.8000, -77.2380 39.8030))', 4326)),

('Cemetery Ridge', '1863-07-02',
 'Main two-mile Union defensive line extending south from Cemetery Hill. Held against repeated Confederate assaults on July 2 and 3.',
 4200,
 ST_GeomFromText('POLYGON((-77.2340 39.8200, -77.2300 39.8200, -77.2290 39.8050, -77.2330 39.8050, -77.2340 39.8200))', 4326)),

('Culp''s Hill', '1863-07-02',
 'Anchor of the Union right flank. Confederate forces captured some breastworks on evening of July 2, but were driven back morning of July 3.',
 2700,
 ST_GeomFromText('POLYGON((-77.2250 39.8230, -77.2210 39.8230, -77.2210 39.8180, -77.2250 39.8180, -77.2250 39.8230))', 4326));

-- Day 3: July 3, 1863
INSERT INTO battle_sites (name, battle_date, description, casualties, geom) VALUES
('Pickett''s Charge', '1863-07-03',
 'Lee''s final assault on the Union center. Nearly 12,500 Confederate soldiers advanced across open fields under devastating artillery and rifle fire. The repulse marked the "High Water Mark of the Confederacy."',
 6500,
 ST_GeomFromText('POLYGON((-77.2360 39.8115, -77.2290 39.8115, -77.2280 39.8085, -77.2340 39.8085, -77.2360 39.8115))', 4326)),

('East Cavalry Field', '1863-07-03',
 'Site of cavalry battle between Union forces under Brig. Gen. David Gregg and Confederate cavalry under J.E.B. Stuart, three miles east of Gettysburg. Stuart''s attempt to attack Union rear was thwarted.',
 850,
 ST_GeomFromText('POLYGON((-77.1850 39.8100, -77.1750 39.8100, -77.1750 39.8000, -77.1850 39.8000, -77.1850 39.8100))', 4326));

-- Overall summary
COMMENT ON TABLE battle_sites IS 'Major engagement areas from the Battle of Gettysburg, July 1-3, 1863. Total battle casualties: ~51,000 (23,000 Union, 28,000 Confederate)';
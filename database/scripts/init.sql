CREATE TABLE locations (
    id serial NOT NULL PRIMARY KEY ,
    name character varying(255) UNIQUE,
    coordinates_lat real NOT NULL,
    coordinates_lng real NOT NULL,
    picture text NOT NULL,
    description text NOT NULL,
    description_html text NOT NULL
);

CREATE TABLE events (
    id serial NOT NULL PRIMARY KEY,
    title character varying(255) UNIQUE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    location character varying(255) NOT NULL REFERENCES public.locations (name),
    picture text NOT NULL,
    price money NOT NULL,
    price_child money,
    price_senior money,
    price_student money,
    description text NOT NULL,
    description_html text NOT NULL
);

CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    street text NOT NULL,
    number text NOT NULL,
    postalcode text NOT NULL, 
    place text NOT NULL, 
    email text NOT NULL UNIQUE,
    password text NOT NULL 
);

CREATE TABLE orders (
    id serial NOT NULL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    price TEXT,
    user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    placed_on timestamp NOT NULL,
    service text NOT NULL
);

CREATE TABLE tickets (
    id serial NOT NULL PRIMARY KEY,
    type integer NOT NULL,
    user_id integer REFERENCES public.users (id) ON DELETE CASCADE,
    event_id integer NOT NULL REFERENCES public.events (id),
    order_id integer NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    id text NOT NULL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE evaluation (
    id serial NOT NULL UNIQUE,
    user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
    event_id integer REFERENCES public.events(id),
    anonym boolean NOT NULL, 
    stars integer CHECK (stars > 0 AND stars < 6) NOT NULL,
    description varchar(300) NOT NULL,
    PRIMARY KEY(user_id,event_id)
);

CREATE TABLE helpful (
    id serial NOT NULL UNIQUE,
    eval_id integer REFERENCES public.evaluation(id),
    user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
    helpful boolean,
    PRIMARY KEY(eval_id, user_id)
);

CREATE TABLE shopping_cart(
    user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_id integer NOT NULL REFERENCES public.events(id),
    normal_amount integer NOT NULL, 
    child_amount integer NOT NULL, 
    senior_amount integer NOT NULL, 
    student_amount integer NOT NULL,
    PRIMARY KEY(user_id,event_id)
);


INSERT INTO locations (name, coordinates_lat, coordinates_lng, picture, description, description_html)
VALUES
('Palmenhaus',47.70442838127333, 9.200002880866347,'attraktion_palmenhaus-3_1080x720.jpg','
Mit seinen Palmen und Orangenbäumen ist das Palmenhaus das exotische Herz der Blumeninsel. Mehr als 20 verschiedene Palmenarten sind hier zu sehen, darunter eine über 15 Meter hohe Kanarische Dattelpalme (Phoenix canariensis).
Das Palmenhaus gibt einen einzigartigen Rahmen für Pflanzenschauen, allen voran die berühmte Orchideenschau im Frühjahr oder die Herbstausstellung im September/Oktober. Auch für andere hochkarätige Veranstaltungen wie Konzerte und Hochzeiten ist das Haus bestens geeignet. Das ganze Jahr über steht zum Verweilen das Schlosscafé mit Terrasse zur Verfügung.Auch aus architektonischer Sicht ist das Palmenhaus etwas Besonderes. 1998 wurde es vollständig erneuert. Die Grundfläche beträgt 1270 qm. Das Haus hat eine maximale Höhe von 17,40 m. Die Dach- und Fassadenelemente sind doppelschalig und aus hochtransparentem Acrylglas. Von den Temperaturen her ist das Palmenhaus als Kalthaus (10-12 Grad C) konzipiert. Bei Bedarf (Veranstaltungen, Orchideenschau) können, unterstützt durch eine zusätzliche Bodenheizung, auch höhere Temperaturen gehalten werden.Hier sind einige der Palmenarten gelistet, die Sie bestaunen können:

Phoenix canariensis (Kanarische Dattelpalme)
Phoenix dactylifera (Echte Dattelpalme)
Phoenix rupicola (Klippen - Dattelpalme)
Phoenix reclinata (Senegal – Dattelpalme)
Phoenix roebelenii (Zwerg-Dattelpalme)
Sabal palmetto (Palmetto-Palme)
Washingtonia robusta (mexikanische Washingtonpalme)
Brahea armata (Hesperidenpalme )
Livistona australis (Australische Livingstonpalme)
Livistona chinensis (Chinesische Livingstonepalme)
Bismarckia nobilis (Bismarck Palme)
Trachycarpus fortunei (Chinesische Hanfpalme )
Trachycarpus wagneriana (Wagners Hanfpalme )
Chamaedorea elegans (Mexikanische Bergpalme)
Areca catechu (Betelpalme)

 
','<div class="col-xs-12 col-md-6">
 <p style="text-align: left;">
  Mit seinen Palmen und Orangenbäumen ist das Palmenhaus das exotische Herz der Blumeninsel. Mehr als 20 verschiedene Palmenarten sind hier zu sehen, darunter eine über 15 Meter hohe Kanarische Dattelpalme (Phoenix canariensis).
 </p>
 <p>
  Das Palmenhaus gibt einen einzigartigen Rahmen für Pflanzenschauen, allen voran die berühmte Orchideenschau im Frühjahr oder die Herbstausstellung im September/Oktober. Auch für andere hochkarätige Veranstaltungen wie Konzerte und Hochzeiten ist das Haus bestens geeignet. Das ganze Jahr über steht zum Verweilen das Schlosscafé mit Terrasse zur Verfügung.
  <br/>
  <br/>
  Auch aus architektonischer Sicht ist das Palmenhaus etwas Besonderes. 1998 wurde es vollständig erneuert. Die Grundfläche beträgt 1270 qm. Das Haus hat eine maximale Höhe von 17,40 m. Die Dach- und Fassadenelemente sind doppelschalig und aus hochtransparentem Acrylglas. Von den Temperaturen her ist das Palmenhaus als Kalthaus (10-12 Grad C) konzipiert. Bei Bedarf (Veranstaltungen, Orchideenschau) können, unterstützt durch eine zusätzliche Bodenheizung, auch höhere Temperaturen gehalten werden.
  <br/>
  <br/>
  Hier sind einige der Palmenarten gelistet, die Sie bestaunen können:
 </p>
 <ul>
  <li>
   Phoenix canariensis (Kanarische Dattelpalme)
  </li>
  <li>
   Phoenix dactylifera (Echte Dattelpalme)
  </li>
  <li>
   Phoenix rupicola (Klippen - Dattelpalme)
  </li>
  <li>
   Phoenix reclinata (Senegal – Dattelpalme)
  </li>
  <li>
   Phoenix roebelenii (Zwerg-Dattelpalme)
  </li>
  <li>
   Sabal palmetto (Palmetto-Palme)
  </li>
  <li>
   Washingtonia robusta (mexikanische Washingtonpalme)
  </li>
  <li>
   Brahea armata (Hesperidenpalme )
  </li>
  <li>
   Livistona australis (Australische Livingstonpalme)
  </li>
  <li>
   Livistona chinensis (Chinesische Livingstonepalme)
  </li>
  <li>
   Bismarckia nobilis (Bismarck Palme)
  </li>
  <li>
   Trachycarpus fortunei (Chinesische Hanfpalme )
  </li>
  <li>
   Trachycarpus wagneriana (Wagners Hanfpalme )
  </li>
  <li>
   Chamaedorea elegans (Mexikanische Bergpalme)
  </li>
  <li>
   Areca catechu (Betelpalme)
  </li>
 </ul>
 <p>
 </p>
</div>
'),('Frühlingsallee',47.70395907736823, 9.196923682379758,'fruehlingsallee-mai-2017.jpg','
Die Frühlingsallee erstreckt sich von den Rothaus-Seeterrassen vorbei am Kinderland hinauf zur Großherzog-Friedrich-Terrasse und dann weiter bis zur Brunnenarena. Hier beginnt alljährlich das Feuerwerk der Blumeninsel. Je nach Witterungsverlauf warten bereits im Februar und März die ersten Frühjahrsblüher wie Schneeglöckchen oder Winterlinge darauf, von den Besuchern entdeckt zu werden. Ende März bzw. Anfang April sorgen die Krokusse für das weitere Frühlingserwachen. Danach überwältigt eine unermessliche Zahl von Narzissen, Hyazinthen und Tulpen mit ihrer Formen- und Farbenvielfalt.
Beim Anblick dieses Farbenmeers vor der Kulisse des tiefblauen Sees und den teilweise noch schneebedeckten Alpen gerät man unweigerlich ins Schwärmen. Was natürlich dem Zufall überlassen aussieht, ist genau geplant. Die Gärtner haben allein etwa 450 verschiedene Tulpen-Sorten für den Start in den Frühling vorbereitet. Jedes Jahr wird im Herbst eine große Zahl an neuen Blumenzwiebeln gepflanzt. Zur Hochblüte gegen Ende April bzw. Anfang Mai öffnen sich dann über eine Million Blüten.
Genau genommen entstand die Frühlingsallee unweit der Brunnenarena aus der Not heraus. Im Jahr 1956 setzte der Frost früh ein und hielt besonders lange an. Der Boden in den vorbereiteten Beeten war so tief gefroren, dass die Blumenzwiebeln nicht mehr rechtzeitig für die Frühjahrsblüte ausgepflanzt werden konnten. Im Lager jedoch warteten einige tausend Narzissen, Tulpen und andere Zwiebelgewächse darauf, in die Erde eingebracht zu werden. Glücklicherweise entdeckte man zufällig, dass die Wiesenflächen unter den alten Esskastanien und Platanen wegen der schützenden Falllaubdecke nicht gefroren waren. Eiligst gruben die Gärtner mit langen Eisenrohren Löcher in den Boden und die Frühlingsblüher kamen doch noch rechtzeitig in die Erde. Im lichten Schatten der Bäume entwickelten sich die Zwiebelblumen so gut, dass man sich entschloss, die Frühlingsallee weiter auszubauen. Mittlerweile ist sie eine der Hauptattraktionen und hat ihren festen Platz im Blütenkalender der Mainau.
','<div class="col-xs-12 col-md-6">
 <p>
  Die Frühlingsallee erstreckt sich von den Rothaus-Seeterrassen vorbei am Kinderland hinauf zur Großherzog-Friedrich-Terrasse und dann weiter bis zur Brunnenarena. Hier beginnt alljährlich das Feuerwerk der Blumeninsel. Je nach Witterungsverlauf warten bereits im Februar und März die ersten Frühjahrsblüher wie Schneeglöckchen oder Winterlinge darauf, von den Besuchern entdeckt zu werden. Ende März bzw. Anfang April sorgen die Krokusse für das weitere Frühlingserwachen. Danach überwältigt eine unermessliche Zahl von Narzissen, Hyazinthen und Tulpen mit ihrer Formen- und Farbenvielfalt.
 </p>
 <p>
  Beim Anblick dieses Farbenmeers vor der Kulisse des tiefblauen Sees und den teilweise noch schneebedeckten Alpen gerät man unweigerlich ins Schwärmen. Was natürlich dem Zufall überlassen aussieht, ist genau geplant. Die Gärtner haben allein etwa 450 verschiedene Tulpen-Sorten für den Start in den Frühling vorbereitet. Jedes Jahr wird im Herbst eine große Zahl an neuen Blumenzwiebeln gepflanzt. Zur Hochblüte gegen Ende April bzw. Anfang Mai öffnen sich dann über eine Million Blüten.
 </p>
 <p>
  Genau genommen entstand die Frühlingsallee unweit der Brunnenarena aus der Not heraus. Im Jahr 1956 setzte der Frost früh ein und hielt besonders lange an. Der Boden in den vorbereiteten Beeten war so tief gefroren, dass die Blumenzwiebeln nicht mehr rechtzeitig für die Frühjahrsblüte ausgepflanzt werden konnten. Im Lager jedoch warteten einige tausend Narzissen, Tulpen und andere Zwiebelgewächse darauf, in die Erde eingebracht zu werden. Glücklicherweise entdeckte man zufällig, dass die Wiesenflächen unter den alten Esskastanien und Platanen wegen der schützenden Falllaubdecke nicht gefroren waren. Eiligst gruben die Gärtner mit langen Eisenrohren Löcher in den Boden und die Frühlingsblüher kamen doch noch rechtzeitig in die Erde. Im lichten Schatten der Bäume entwickelten sich die Zwiebelblumen so gut, dass man sich entschloss, die Frühlingsallee weiter auszubauen. Mittlerweile ist sie eine der Hauptattraktionen und hat ihren festen Platz im Blütenkalender der Mainau.
 </p>
</div>
'),('Schmetterlingshaus',47.70634526334897, 9.194182645066592,'attraktion_schmetterling_1080x720-1.jpg','
Ein Höhepunkt des Mainau-Tages ist sicherlich ein Besuch im zweitgrößten Schmetterlingshaus Deutschlands. Beim Rundgang durch die exotische Landschaft mit einzigartiger Vegetation kommt echtes Tropenfeeling auf:Bei einer ca. 90%igen Luftfeuchtigkeit und Temperaturen zwischen 25°C und 30°C kann man frei fliegende tropische Tagfalter aus Afrika, Asien, Mittel- und Südamerika in ca. 120 verschiedenen Arten bestaunen.Zeitweise sind auch Nachtfalter mit bis zu 30 cm Flügelspannweite zu sehen. 70% der Falter kommen direkt aus den Herkunftsländern, wo sie in speziellen Zuchtfarmen gezüchtet werden. Diese kommen wöchentlich als Puppen auf der Insel Mainau an. Die restlichen 30% vermehren sich direkt im Schmetterlingshaus an den jeweiligen Futterpflanzen.Dort kann die Entwicklung vom Ei über Raupe (Larve) und Puppe bis zum fertigen Falter beobachtet werden.Im Shop finden Sie ein großes Angebot an Mainau-Souvenirs. Im Bistrobereich gibt es ganzjährig Kaffee, Eis und Getränke. Während der Saison erhalten Sie auch einen kleinen Imbiss.Am 24. & 31. Dezember ist das Schmetterlingshaus von 10.00 bis 14.00 Uhr geöffnet.
','<div class="col-xs-12 col-md-6">
 <p style="text-align: left;">
  Ein Höhepunkt des Mainau-Tages ist sicherlich ein Besuch im zweitgrößten Schmetterlingshaus Deutschlands. Beim Rundgang durch die exotische Landschaft mit einzigartiger Vegetation kommt echtes Tropenfeeling auf:
  <br/>
  <br/>
  Bei einer ca. 90%igen Luftfeuchtigkeit und Temperaturen zwischen 25°C und 30°C kann man frei fliegende tropische Tagfalter aus Afrika, Asien, Mittel- und Südamerika in ca. 120 verschiedenen Arten bestaunen.
  <br/>
  Zeitweise sind auch Nachtfalter mit bis zu 30 cm Flügelspannweite zu sehen. 70% der Falter kommen direkt aus den Herkunftsländern, wo sie in speziellen Zuchtfarmen gezüchtet werden. Diese kommen wöchentlich als Puppen auf der Insel Mainau an. Die restlichen 30% vermehren sich direkt im Schmetterlingshaus an den jeweiligen Futterpflanzen.
  <br/>
  Dort kann die Entwicklung vom Ei über Raupe (Larve) und Puppe bis zum fertigen Falter beobachtet werden.
  <br/>
  <br/>
  Im Shop finden Sie ein großes Angebot an Mainau-Souvenirs. Im Bistrobereich gibt es ganzjährig Kaffee, Eis und Getränke. Während der Saison erhalten Sie auch einen kleinen Imbiss.
  <br/>
  <br/>
  Am 24. &amp; 31. Dezember ist das Schmetterlingshaus von 10.00 bis 14.00 Uhr geöffnet.
 </p>
</div>
'),('Barockschloss',47.704973490505225, 9.200019295279935,'attraktion_schloss_1080x720.jpg','
Architektonischer Mittelpunkt und prachtvolle Kulisse für verschiedenste Anlässe: das Deutschordensschloss. Hier schlägt das Herz der Insel, hier lebt Björn Graf Bernadotte.1739 bis 1746 wurde das Deutschordenschloss nach den Entwürfen Johann Caspar Bagnatos und unter seiner Bauleitung erbaut. Trotz beschränkter Finanzen entstand eine architektonisch höchst ausgewogene, symmetrische Schlossanlage von großer Harmonie. Hufeisenförmig öffnen sich die Arme der beiden Seitenflügel zum Festland. Dagegen ist die breite Seite dem See zugewandt. Das Gebäude ruht auf einem Sockel, über den sich zwei Stockwerke erheben. Prächtig am Westgiebel: die Wappen des Hochmeisters Clemens August von Bayern, des Landkomturs Philipp von Froberg und des Mainaukomturs Friedrich von Baden. Der Ostgiebel zur Seeseite trägt das Wappen des Deutschen Ordens.Bagnato verzichtet in seinem Entwurf auf ein prächtiges repräsentatives Treppenhaus nach Würzburger Vorbild. Die Obergeschosse erreicht man über schlicht gehaltene Treppenhäuser in den Seitenflügeln.Herzstück des Schlosses ist der ehemalige Audienzsaal, der in Weiß und Gold gehaltene sog. "Weiße Saal", der sein heutiges Aussehen erst 1883 erhielt. Er ist nur zu Konzerten oder besonderen Veranstaltungen öffentlich zugänglich. Für das Publikum geöffnet im Rahmen wechselnder Ausstellungen ist auch der Wappensaal, zentraler Raum im Untergeschoss des ursprünglichen Corps de Logis. Dazu die Räume des Schlosscafés im Übergang zum Palmenhaus.Schloss und Kirche bilden in ihrer klaren Architektursprache ein großartiges, harmonisches Ensemble - sie sind ein einzigartiges Beispiel süddeutschen Barocks.
Zu Ausstellungen, Veranstaltungen und im Bereich des Schlosscafés ist der untere Bereich für Besucherinnen und Besucher zugänglich.
','<div class="col-xs-12 col-md-6">
 <p style="text-align: left;">
  Architektonischer Mittelpunkt und prachtvolle Kulisse für verschiedenste Anlässe: das Deutschordensschloss. Hier schlägt das Herz der Insel, hier lebt Björn Graf Bernadotte.
  <br/>
  <br/>
  1739 bis 1746 wurde das Deutschordenschloss nach den Entwürfen Johann Caspar Bagnatos und unter seiner Bauleitung erbaut. Trotz beschränkter Finanzen entstand eine architektonisch höchst ausgewogene, symmetrische Schlossanlage von großer Harmonie. Hufeisenförmig öffnen sich die Arme der beiden Seitenflügel zum Festland. Dagegen ist die breite Seite dem See zugewandt. Das Gebäude ruht auf einem Sockel, über den sich zwei Stockwerke erheben. Prächtig am Westgiebel: die Wappen des Hochmeisters Clemens August von Bayern, des Landkomturs Philipp von Froberg und des Mainaukomturs Friedrich von Baden. Der Ostgiebel zur Seeseite trägt das Wappen des Deutschen Ordens.
  <br/>
  Bagnato verzichtet in seinem Entwurf auf ein prächtiges repräsentatives Treppenhaus nach Würzburger Vorbild. Die Obergeschosse erreicht man über schlicht gehaltene Treppenhäuser in den Seitenflügeln.
  <br/>
  <br/>
  Herzstück des Schlosses ist der ehemalige Audienzsaal, der in Weiß und Gold gehaltene sog. "Weiße Saal", der sein heutiges Aussehen erst 1883 erhielt. Er ist nur zu Konzerten oder besonderen Veranstaltungen öffentlich zugänglich. Für das Publikum geöffnet im Rahmen wechselnder Ausstellungen ist auch der Wappensaal, zentraler Raum im Untergeschoss des ursprünglichen Corps de Logis. Dazu die Räume des Schlosscafés im Übergang zum Palmenhaus.
  <br/>
  <br/>
  Schloss und Kirche bilden in ihrer klaren Architektursprache ein großartiges, harmonisches Ensemble - sie sind ein einzigartiges Beispiel süddeutschen Barocks.
 </p>
 <p>
  <em>
   Zu Ausstellungen, Veranstaltungen und im Bereich des Schlosscafés ist der untere Bereich für Besucherinnen und Besucher zugänglich.
  </em>
 </p>
</div>
'),('Italienische Blumen-Wassertreppe',47.70324789339781, 9.19936957528249,'2016-wassertreppe.jpg','
Die Italienische Blumenwassertreppe verbindet die Mediterran-Terrassen und den tiefer gelegenen Uferbereich durch einen Wasserlauf aus Calanca-Gneis aus dem Tessin. Die Kaskade ist dem Stil italienischer Renaissancegärten nachempfunden und wird von säulenförmigen echten Zypressen (Cupressus sempervirens) begleitet. Im Frühjahr und Sommer versprüht eine abwechslungsreiche Wechselflorpflanzung südländisches Flair, im Herbst setzt die prächtige Baumfärbung reizvolle Akzente.
Direkt neben der Wassertreppe haben die Mainau-Gärtner den Päoniengarten angelegt. Hier wurden etliche Strauchpfingstrosen mit Stauden kombiniert. Zur Blütezeit im Mai zieht dieser Garten die Besucher besonders in seinen Bann.
','<div class="col-xs-12 col-md-6">
 <p>
  Die Italienische Blumenwassertreppe verbindet die Mediterran-Terrassen und den tiefer gelegenen Uferbereich durch einen Wasserlauf aus Calanca-Gneis aus dem Tessin. Die Kaskade ist dem Stil italienischer Renaissancegärten nachempfunden und wird von säulenförmigen echten Zypressen (Cupressus sempervirens) begleitet. Im Frühjahr und Sommer versprüht eine abwechslungsreiche Wechselflorpflanzung südländisches Flair, im Herbst setzt die prächtige Baumfärbung reizvolle Akzente.
 </p>
 <p>
  Direkt neben der Wassertreppe haben die Mainau-Gärtner den Päoniengarten angelegt. Hier wurden etliche Strauchpfingstrosen mit Stauden kombiniert. Zur Blütezeit im Mai zieht dieser Garten die Besucher besonders in seinen Bann.
 </p>
</div>
'),('Staudengarten',47.70341034744403, 9.196519919895831,'staudengarten_1080x720-1.jpg','
Der Mainauer Staudengarten bietet zu jeder Jahreszeit ein anderes faszinierendes Bild: Der dunkelblaue Rittersporn, die Sonnenbraut (Helenium ‘Rubinzwerg‘), Kerzenknöterich (Bistorta amplexicaulis ‘Blackfield‘), Kugeldisteln (Echinops banaticus ‘Taplow Blue‘) und viele weitere Staudengewächse sind hier anzutreffen. Im Sommer scheinen die Blüten des Patagonisches Eisenkrauts (Verbena bonariensis) im Sommerwind zu tanzen, leuchtend gelbe Farbakzente setzt im Spätsommer der Gewöhnliche Sonnenhut (Rudbeckia fulgida). Genauso beeindruckend ist auch das rosafarbene Blütenmeer des Echinaceas.
Weit mehr als 20.000 Pflanzen in über 700 verschiedenen Sorten sind hier im Staudengarten anzutreffen: Prärie- und Steppenpflanzen werden gekonnt mit Prachtstauden wie Orientalischem Mohn, Pfingstrosen und Taglilien kombiniert.
Auch im Herbst und im Winter bietet der Staudengarten einen attraktiven Anblick: Gräser und Gehölze mit interessanten Rindenfarben- und -strukturen sorgen für abwechslungsreiche Höhepunkte.
','<div class="col-xs-12 col-md-6">
 <p>
  Der Mainauer Staudengarten bietet zu jeder Jahreszeit ein anderes faszinierendes Bild: Der dunkelblaue Rittersporn, die Sonnenbraut (
  <em>
   Helenium ‘Rubinzwerg‘
  </em>
  ), Kerzenknöterich (
  <em>
   Bistorta amplexicaulis ‘Blackfield‘
  </em>
  ), Kugeldisteln (
  <em>
   Echinops banaticus ‘Taplow Blue‘
  </em>
  ) und viele weitere Staudengewächse sind hier anzutreffen. Im Sommer scheinen die Blüten des Patagonisches Eisenkrauts (
  <em>
   Verbena bonariensis
  </em>
  ) im Sommerwind zu tanzen, leuchtend gelbe Farbakzente setzt im Spätsommer der Gewöhnliche Sonnenhut (
  <em>
   Rudbeckia fulgida
  </em>
  ). Genauso beeindruckend ist auch das rosafarbene Blütenmeer des Echinaceas.
 </p>
 <p>
  Weit mehr als 20.000 Pflanzen in über 700 verschiedenen Sorten sind hier im Staudengarten anzutreffen: Prärie- und Steppenpflanzen werden gekonnt mit Prachtstauden wie Orientalischem Mohn, Pfingstrosen und Taglilien kombiniert.
 </p>
 <p>
  Auch im Herbst und im Winter bietet der Staudengarten einen attraktiven Anblick: Gräser und Gehölze mit interessanten Rindenfarben- und -strukturen sorgen für abwechslungsreiche Höhepunkte.
 </p>
</div>
'),('Dahliengarten',47.703208182331736, 9.197904666582108,'Dahlien-4.jpg','
Der Dahliengarten im FrühlingIm Frühjahr verwandeln sich die weitläufigen Beete des Dahliengartens in ein farbenfrohes Meer mit beliebten Frühlingsblumen wie späten Tulpensorten, Zierlauch, Islandmohn und Vergißmeinnicht. Bis Mitte Juni können die Besucher hier einen charmanten Blütenreigen mit einzigartiger Sicht auf den Bodensee erleben. Danach beginnen die Mainau-Gärtner die Dahlien auszupflanzen, die den Herbst auf der Blumeninsel krönen. Außerdem ist hier die Skulptur einer Frau zu finden, die als die "Weinkönigin" bezeichnet wird.
Der Dahliengarten im SpätsommerDie Farbenpracht und vielfältigen Blütenvariationen der Dahlien sind die Herbstattraktion auf der Insel Mainau. Von Ende August bis Mitte Oktober erstrahlt der Dahliengarten im Südhang der Insel mit rund 12.000 Dahlien in einem wahren Blütenfeuerwerk.
Die bunten Schönheiten aus Mexiko werden auf 2.400 Quadratmeter Beetfläche angeordnet und nach Wuchshöhe gestaffelt gepflanzt. Die niedrigsten Dahlien messen zirka 40 Zentimeter in der Höhe, während es die Riesen bis auf 2 Meter Höhe bringen. Die Blütengröße variiert von den Kleinsten bei den Mignon-Dahlien mit 4 Zentimetern bis zu den Größten mit 25 Zentimetern bei den großblumigen, dekorativen Dahlien.Die sonnenverwöhnten Dahlien erfreuen die Besucher in allen erdenklichen Farbschattierungen, Formen und Größen. So fällt es nicht leicht aus den großzügig angelegten Beeten die jährliche Mainau-Dahlienkönigin zu wählen: Kaktus- und Semikaktus-, Halskrausendahlie, einfache Dahlienformen, Seesternblütige, Balldahlie, Anemonen- und Paeonienblütige und viele andere Dahliensorten präsentieren sich zum herbstlichen Schlussakkord.
 
','<div class="col-xs-12 col-md-6">
 <p>
  <strong>
   Der Dahliengarten im Frühling
  </strong>
  <br/>
  Im Frühjahr verwandeln sich die weitläufigen Beete des Dahliengartens in ein farbenfrohes Meer mit beliebten Frühlingsblumen wie späten Tulpensorten, Zierlauch, Islandmohn und Vergißmeinnicht. Bis Mitte Juni können die Besucher hier einen charmanten Blütenreigen mit einzigartiger Sicht auf den Bodensee erleben. Danach beginnen die Mainau-Gärtner die Dahlien auszupflanzen, die den Herbst auf der Blumeninsel krönen. Außerdem ist hier die Skulptur einer Frau zu finden, die als die "Weinkönigin" bezeichnet wird.
 </p>
 <p>
  <strong>
   Der Dahliengarten im Spätsommer
  </strong>
  <br/>
  Die Farbenpracht und vielfältigen Blütenvariationen der Dahlien sind die Herbstattraktion auf der Insel Mainau. Von Ende August bis Mitte Oktober erstrahlt der Dahliengarten im Südhang der Insel mit rund 12.000 Dahlien in einem wahren Blütenfeuerwerk.
 </p>
 <p>
  Die bunten Schönheiten aus Mexiko werden auf 2.400 Quadratmeter Beetfläche angeordnet und nach Wuchshöhe gestaffelt gepflanzt. Die niedrigsten Dahlien messen zirka 40 Zentimeter in der Höhe, während es die Riesen bis auf 2 Meter Höhe bringen. Die Blütengröße variiert von den Kleinsten bei den Mignon-Dahlien mit 4 Zentimetern bis zu den Größten mit 25 Zentimetern bei den großblumigen, dekorativen Dahlien.
  <br/>
  <br/>
  Die sonnenverwöhnten Dahlien erfreuen die Besucher in allen erdenklichen Farbschattierungen, Formen und Größen. So fällt es nicht leicht aus den großzügig angelegten Beeten die jährliche Mainau-Dahlienkönigin zu wählen: Kaktus- und Semikaktus-, Halskrausendahlie, einfache Dahlienformen, Seesternblütige, Balldahlie, Anemonen- und Paeonienblütige und viele andere Dahliensorten präsentieren sich zum herbstlichen Schlussakkord.
 </p>
 <p>
 </p>
</div>
'),('Arboretum',47.70489046099024, 9.19655893576001,'arboretum_1080x720-1.jpg','
Das wertvolle Arboretum macht die Mainau zu einem einzigartigem Parkerlebnis. Und das zu jeder Jahreszeit. Dieser Parkbereich lädt zum Promenieren, Verweilen und Studieren ein. Willkommen unter riesigen Mammutbäumen, Atlas- und Libanon-Zedern, Metasequoien, Tulpenbäumen um nur einige der berühmtesten zu nennen.
Das Wort Arboretum leitet sich von dem lateinischen Wort Arbor (=Baum) ab und bezeichnet eine Sammlung, meist exotischer Gehölze. Das Arboretum der Mainau wurde 1864 von Großherzog Friedrich begründet, nachdem dieser 1853 die Mainau als Sommerresidenz erworben hatte. Nach und nach ließ der pflanzeninteressierte Großherzog fremdländische Gehölze aus fast allen Kontinenten auf dem Hochplateau der Insel anpflanzen und legte damit den Grundstock für das heutige Arboretum. Die Bäume wurden rein aus Sammlerleidenschaft und ästhetischen Gründen gepflanzt und weniger aus wissenschaftlicher Sicht, wie dies bei anderen Arboreten üblich ist. Schnell wurde die Mainau für ihre Sammlung an seltenen und schön gewachsenen Koniferen bekannt und mehr als 150 Jahre später sind es vor allem die "Zapfenträger", die die Skyline und das Erscheinungsbild der Blumeninsel prägen.
Heute umfasst das Arboretum annähernd 250 Gehölzarten und –sorten, darunter viele:
Bergmammutbäume (Sequoiadendron giganteum) und Küstenmammutbäume (Sequoia sempervirens), die im 19. Jahrhundert aus Kalifornien nach Europa kamen. Weitere Baumarten im Arboretum sind:

Atlaszeder (Cedrus atlantica)
Himalayazeder (Cedrus deodara)
Weihrauchzeder (Calocedrus decurrens)
Scheinzypressen (Chamaecyparis spec.)
Lebensbäume (Thuja spec.) 
Kalifornische Dufteibe (Torreya californica)
Tannen (Abies grandis, A. pinsapo, A. nordmanniana, A. cephalonica)
Fichten (Picea spec.)
Magnolien (Magnolia spec.)
Zierkirschen (Prunus spec.)
Taschentuchbaum (Davidia involucrata var. vilmoriniana)
Buchen (Fagus spec.)
Linden (Tilia spec.)
Platanen (Platanus x hispanica)
Eichen (Quercus spec.)
Nussbäume (Juglans spec.)
Katsurabaum (Cercidiphyllum japonicum)
Trompetenbäume (Catalpa bignonioides und C. ovata)

Wollen Sie Ihr botanisches Wissen vertiefen? Das Buch "Die Pflanzenwelt der Mainau" ist in allen Souvenir-Shops erhältlich.
','<div class="col-xs-12 col-md-6">
 <p class="bodytext">
  Das wertvolle Arboretum macht die Mainau zu einem einzigartigem Parkerlebnis. Und das zu jeder Jahreszeit. Dieser Parkbereich lädt zum Promenieren, Verweilen und Studieren ein. Willkommen unter riesigen Mammutbäumen, Atlas- und Libanon-Zedern, Metasequoien, Tulpenbäumen um nur einige der berühmtesten zu nennen.
 </p>
 <p class="bodytext">
  Das Wort Arboretum leitet sich von dem lateinischen Wort Arbor (=Baum) ab und bezeichnet eine Sammlung, meist exotischer Gehölze. Das Arboretum der Mainau wurde 1864 von Großherzog Friedrich begründet, nachdem dieser 1853 die Mainau als Sommerresidenz erworben hatte. Nach und nach ließ der pflanzeninteressierte Großherzog fremdländische Gehölze aus fast allen Kontinenten auf dem Hochplateau der Insel anpflanzen und legte damit den Grundstock für das heutige Arboretum. Die Bäume wurden rein aus Sammlerleidenschaft und ästhetischen Gründen gepflanzt und weniger aus wissenschaftlicher Sicht, wie dies bei anderen Arboreten üblich ist. Schnell wurde die Mainau für ihre Sammlung an seltenen und schön gewachsenen Koniferen bekannt und mehr als 150 Jahre später sind es vor allem die "Zapfenträger", die die Skyline und das Erscheinungsbild der Blumeninsel prägen.
 </p>
 <p class="bodytext">
  Heute umfasst das Arboretum annähernd 250 Gehölzarten und –sorten, darunter viele:
 </p>
 <p class="bodytext">
  Bergmammutbäume (Sequoiadendron giganteum) und Küstenmammutbäume (Sequoia sempervirens), die im 19. Jahrhundert aus Kalifornien nach Europa kamen. Weitere Baumarten im Arboretum sind:
 </p>
 <ul>
  <li class="bodytext">
   Atlaszeder (Cedrus atlantica)
  </li>
  <li class="bodytext">
   Himalayazeder (Cedrus deodara)
  </li>
  <li class="bodytext">
   Weihrauchzeder (Calocedrus decurrens)
  </li>
  <li class="bodytext">
   Scheinzypressen (Chamaecyparis spec.)
  </li>
  <li class="bodytext">
   Lebensbäume (Thuja spec.)
  </li>
  <li class="bodytext">
   Kalifornische Dufteibe (Torreya californica)
  </li>
  <li class="bodytext">
   Tannen (Abies grandis, A. pinsapo, A. nordmanniana, A. cephalonica)
  </li>
  <li class="bodytext">
   Fichten (Picea spec.)
  </li>
  <li class="bodytext">
   Magnolien (Magnolia spec.)
  </li>
  <li class="bodytext">
   Zierkirschen (Prunus spec.)
  </li>
  <li class="bodytext">
   Taschentuchbaum (Davidia involucrata var. vilmoriniana)
  </li>
  <li class="bodytext">
   Buchen (Fagus spec.)
  </li>
  <li class="bodytext">
   Linden (Tilia spec.)
  </li>
  <li class="bodytext">
   Platanen (Platanus x hispanica)
  </li>
  <li class="bodytext">
   Eichen (Quercus spec.)
  </li>
  <li class="bodytext">
   Nussbäume (Juglans spec.)
  </li>
  <li class="bodytext">
   Katsurabaum (Cercidiphyllum japonicum)
  </li>
  <li class="bodytext">
   Trompetenbäume (Catalpa bignonioides und C. ovata)
  </li>
 </ul>
 <p class="bodytext">
  Wollen Sie Ihr botanisches Wissen vertiefen? Das Buch "Die Pflanzenwelt der Mainau" ist in allen Souvenir-Shops erhältlich.
 </p>
</div>
'),('Italienischer Rosengarten',47.7039662974603, 9.199755351361773,'italienischer-rosengarten-2019.jpg','
Südlich von Schloss Mainau im Italienischen Rosengarten hat die Königin der Blumen einen standesgemäßen Platz gefunden. Großherzog Friedrich I. von Baden gab die streng geometrische Anlage im 19. Jahrhundert in Auftrag. Darin versprühen Pergolen und vier Marmorskulpturen, die die vier Jahreszeiten symbolisieren, ein Flair, das zum Flanieren, Verweilen und Genießen einlädt. Der westliche Laubengang öffnet sich in seiner Mitte zu einem kleinen Platz. Hier bildet ein Brunnen mit einer sitzenden Victoria mit Kranz von Christian Daniel Rauch den Abschluss der von Ost nach West verlaufenden Mittelachse des Gartens.
Neben den klassischen Beetrosen sind üppig rankende Kletterrosen an Spalieren, elegante Hochstämme und kunstvolle Rosenpyramiden in 1.000 Sorten zu bewundern. Das leuchtende Farbenband ändert sich von Jahr zu Jahr, denn die Mainau-Gärtner pflanzen immer wieder neue Rosensorten. Deren betörende Düfte, Blütenfülle und Eleganz werden während der ersten Hochblüte ab Mitte Juni und der zweiten im August zum sinnlichen Erlebnis.
 
','<div class="col-xs-12 col-md-6">
 <p>
  Südlich von Schloss Mainau im Italienischen Rosengarten hat die Königin der Blumen einen standesgemäßen Platz gefunden. Großherzog Friedrich I. von Baden gab die streng geometrische Anlage im 19. Jahrhundert in Auftrag. Darin versprühen Pergolen und vier Marmorskulpturen, die die vier Jahreszeiten symbolisieren, ein Flair, das zum Flanieren, Verweilen und Genießen einlädt. Der westliche Laubengang öffnet sich in seiner Mitte zu einem kleinen Platz. Hier bildet ein Brunnen mit einer sitzenden Victoria mit Kranz von Christian Daniel Rauch den Abschluss der von Ost nach West verlaufenden Mittelachse des Gartens.
 </p>
 <p>
  Neben den klassischen Beetrosen sind üppig rankende Kletterrosen an Spalieren, elegante Hochstämme und kunstvolle Rosenpyramiden in 1.000 Sorten zu bewundern. Das leuchtende Farbenband ändert sich von Jahr zu Jahr, denn die Mainau-Gärtner pflanzen immer wieder neue Rosensorten. Deren betörende Düfte, Blütenfülle und Eleganz werden während der ersten Hochblüte ab Mitte Juni und der zweiten im August zum sinnlichen Erlebnis.
 </p>
 <p>
 </p>
</div>
'),('Hortensienweg',47.70617198877131, 9.19955146403599,'attraktion_hortensie-1_1080x720.jpg','
Der sog. Hortensienweg verbindet das Hochplateau der Insel mit dem Ufergarten und dem Hafenbereich. Er führt am Restaurant Schwedenschenke und Würstlegrill vorbei durch den Dachgarten der Comturey bis in den Ufergarten zur Blumenuhr. Schon auf alten Plänen und Karten, die die Insel Mainau zeigen, ist an dieser Stelle ein Weg eingezeichnet.
Im oberen Bereich wird der Weg von weiß- und rotblühenden, teilweise sehr mächtigen Rosskastanien begleitet. Die windgeschützte, nach Norden ausgerichtete Situation in diesem Bereich der Insel sorgt dafür, dass sich die Flächen entlang des Weges gut für die Kultur von Hortensien eignet.
Hortensien lieben einen sonnigen bis halbschattigen, windgeschützten Standort und nahrhafte, genügend frische, humose Böden. Was ihre Breite betrifft, warten die Hortensien mit so mancher Besonderheit auf: Das, was der Laie als Blüte wahrnimmt, ist genau genommen ein Blütenstand, im Fall der Hortensien als Rispe bezeichnet. Die inneren Blüten einer solchen Rispe sind sehr klein, aber vollständig ausgebildet und fertil, d.h. sie besitzen Staub- und Fruchtblätter. Der äußere Kranz besteht aus unvollständigen, sterilen Blüten, deren Kelchblätter stark vergrößert und kronblattartig gefärbt sind. Die Blütenblätter sind stark reduziert oder fehlen ganz. Dieser Schauapparat soll die Insekten anlocken. Gefüllte blühende Sorten haben oftmals ausschließlich solche sterilen Blüten.
','<div class="col-xs-12 col-md-6">
 <p>
  Der sog. Hortensienweg verbindet das Hochplateau der Insel mit dem Ufergarten und dem Hafenbereich. Er führt am Restaurant Schwedenschenke und Würstlegrill vorbei durch den Dachgarten der Comturey bis in den Ufergarten zur Blumenuhr. Schon auf alten Plänen und Karten, die die Insel Mainau zeigen, ist an dieser Stelle ein Weg eingezeichnet.
 </p>
 <p>
  Im oberen Bereich wird der Weg von weiß- und rotblühenden, teilweise sehr mächtigen Rosskastanien begleitet. Die windgeschützte, nach Norden ausgerichtete Situation in diesem Bereich der Insel sorgt dafür, dass sich die Flächen entlang des Weges gut für die Kultur von Hortensien eignet.
 </p>
 <p>
  Hortensien lieben einen sonnigen bis halbschattigen, windgeschützten Standort und nahrhafte, genügend frische, humose Böden. Was ihre Breite betrifft, warten die Hortensien mit so mancher Besonderheit auf: Das, was der Laie als Blüte wahrnimmt, ist genau genommen ein Blütenstand, im Fall der Hortensien als Rispe bezeichnet. Die inneren Blüten einer solchen Rispe sind sehr klein, aber vollständig ausgebildet und fertil, d.h. sie besitzen Staub- und Fruchtblätter. Der äußere Kranz besteht aus unvollständigen, sterilen Blüten, deren Kelchblätter stark vergrößert und kronblattartig gefärbt sind. Die Blütenblätter sind stark reduziert oder fehlen ganz. Dieser Schauapparat soll die Insekten anlocken. Gefüllte blühende Sorten haben oftmals ausschließlich solche sterilen Blüten.
 </p>
</div>
'),('Dachgarten',47.705009590253106, 9.199713078336453,'1-dachgarten-hortensien.jpg','
Verschlungene Wege, blühende Gehölze und Sträucher, der im Sonnenlicht glitzernde Bodensee – diese Postkarten-Idylle erleben Sie auf dem intensiv begrünten Dachgarten der Comturey. Unterhalb von Schloss Mainau erstreckt sich auf einer Fläche von 1.400 Quadratmetern ein kleines Pflanzenparadies, das darauf wartet von unseren Besucherinnen und Besuchern entdeckt zu werden. Das Besondere daran, es bietet nicht nur über 15.000 Pflanzen ein Zuhause, sondern ist auch der „Kopfschmuck“ unseres Restaurants Comturey im Hafenbereich der Insel. Ab und zu vermischt sich das laue Sommerlüftchen mit dem aromatischen Duft von Frischgebackenem aus dem „Täglich Brot“ und macht die Sommerstimmung perfekt.
Der pflanzliche Schwerpunkt des Dachgartens liegt u.a. bei der Präsentation von Gehölz- und Staudenpflanzungen sowie klassischer Garten-Hortensien. Über 50 verschiedene Sorten der Hydrangea macrophylla mit ihren ballförmigen Blüten wurden hier mit verschiedenen Begleitstauden zu farblich aufeinander abgestimmten Pflanzkombinationen arrangiert.
','<div class="col-xs-12 col-md-6">
 <p>
  Verschlungene Wege, blühende Gehölze und Sträucher, der im Sonnenlicht glitzernde Bodensee – diese Postkarten-Idylle erleben Sie auf dem intensiv begrünten Dachgarten der Comturey. Unterhalb von Schloss Mainau erstreckt sich auf einer Fläche von 1.400 Quadratmetern ein kleines Pflanzenparadies, das darauf wartet von unseren Besucherinnen und Besuchern entdeckt zu werden. Das Besondere daran, es bietet nicht nur über 15.000 Pflanzen ein Zuhause, sondern ist auch der „Kopfschmuck“ unseres Restaurants Comturey im Hafenbereich der Insel. Ab und zu vermischt sich das laue Sommerlüftchen mit dem aromatischen Duft von Frischgebackenem aus dem „Täglich Brot“ und macht die Sommerstimmung perfekt.
 </p>
 <p>
  Der pflanzliche Schwerpunkt des Dachgartens liegt u.a. bei der Präsentation von Gehölz- und Staudenpflanzungen sowie klassischer Garten-Hortensien. Über 50 verschiedene Sorten der Hydrangea macrophylla mit ihren ballförmigen Blüten wurden hier mit verschiedenen Begleitstauden zu farblich aufeinander abgestimmten Pflanzkombinationen arrangiert.
 </p>
</div>
'),('Promenade der Wild- und Strauchrosen',47.704060158566335, 9.194288862895604,'wildundstrauch_1080x720-1.jpg','

Eine der schönsten Promenaden der Insel lockt mit köstlichen Dufterlebnissen und prunkt mit historischen Kostbarkeiten: Die Rosensammlung, zurecht von Kennern gerühmt, umfasst mehr als 400 Rosensorten.
Besonders wertvoll sind die alten Rosen, darunter viele Wildformen, die wohl schon vor 3.000 Jahren die Gärten des Orients schmückten. Der Blütenflor beginnt mit einer Vielzahl zum Teil sehr seltener Wildrosen ab Anfang Mai. Neben den Wildrosen gibt es hier teilweise neueste Züchtungen von öfter- und dauerblühenden Rosen-Hybriden.
Die Hochblüte im Juni ist ein unvergessliches, sinnliches Erlebnis für die Mainau-Gäste.

','<div class="col-xs-12 col-md-6">
 <div class="csc-textpic-text">
  <p class="bodytext">
   Eine der schönsten Promenaden der Insel lockt mit köstlichen Dufterlebnissen und prunkt mit historischen Kostbarkeiten: Die Rosensammlung, zurecht von Kennern gerühmt, umfasst mehr als 400 Rosensorten.
  </p>
  <p class="bodytext">
   Besonders wertvoll sind die alten Rosen, darunter viele Wildformen, die wohl schon vor 3.000 Jahren die Gärten des Orients schmückten. Der Blütenflor beginnt mit einer Vielzahl zum Teil sehr seltener Wildrosen ab Anfang Mai. Neben den Wildrosen gibt es hier teilweise neueste Züchtungen von öfter- und dauerblühenden Rosen-Hybriden.
  </p>
  <p class="bodytext">
   Die Hochblüte im Juni ist ein unvergessliches, sinnliches Erlebnis für die Mainau-Gäste.
  </p>
 </div>
</div>
'),('Mediterran-Terrassen',47.70362334198208, 9.198467214909389,'attraktion_brunnenarena-1_1080x720.jpg','
Das perfekte Bühnenbild für die mediterrane Pflanzenwelt: die Brunnenarena mit den Mediterran-Terrassen. In der warmen Jahreszeit säumen viele tropische Gewächse den Weg zur Brunnenarena. In der weitläufigen Gartenanlage mit der prächtig bepflanzten Terrassenlandschaft kommt bei einzigartigem Panorama über die Bodenseelandschaft mediterranes Flair auf.
Besonders auffallend und tropisch anmutend ist zum Beispiel ein großes und altes Exemplar der Trompetenblume (Campsis grandiflora), ein Klettergehölz, das ab Juli leuchtend orangerot blüht. Dazu vermitteln eine Vielzahl weiterer subtropischer und tropischer Gewächse wie etwa Palmen, Agaven und Bougainevillen vor einer mediterranen Gehölzkulisse aus Esskastanien und verschiedenen Zypressenarten ein Gefühl wie am Mittelmeer. Von hier hat man auch einen herrlichen Blick auf die Wassertreppe und den Dahliengarten.
Der Schwanenbrunnen, der Teil der sogenannten Brunnenarena ist, wurde 1979 aus Anlass des 70. Geburtstag von Lennart Graf Bernadotte geschaffen. 
','<div class="col-xs-12 col-md-6">
 <p style="text-align: left;">
  Das perfekte Bühnenbild für die mediterrane Pflanzenwelt: die Brunnenarena mit den Mediterran-Terrassen. In der warmen Jahreszeit säumen viele tropische Gewächse den Weg zur Brunnenarena. In der weitläufigen Gartenanlage mit der prächtig bepflanzten Terrassenlandschaft kommt bei einzigartigem Panorama über die Bodenseelandschaft mediterranes Flair auf.
 </p>
 <p>
  Besonders auffallend und tropisch anmutend ist zum Beispiel ein großes und altes Exemplar der Trompetenblume (Campsis grandiflora), ein Klettergehölz, das ab Juli leuchtend orangerot blüht. Dazu vermitteln eine Vielzahl weiterer subtropischer und tropischer Gewächse wie etwa Palmen, Agaven und Bougainevillen vor einer mediterranen Gehölzkulisse aus Esskastanien und verschiedenen Zypressenarten ein Gefühl wie am Mittelmeer. Von hier hat man auch einen herrlichen Blick auf die Wassertreppe und den Dahliengarten.
 </p>
 <p>
  Der Schwanenbrunnen, der Teil der sogenannten Brunnenarena ist, wurde 1979 aus Anlass des 70. Geburtstag von Lennart Graf Bernadotte geschaffen.
 </p>
</div>
'),('Metasequoia-Allee',47.70494461068893, 9.191793073164481,'metasequoia_1080x720.jpg','
Sie ist ein lebendes Fossil, unter dem bereits die Dinosaurier wandelten: Metasequoia (auch Chinesisches Rotholz). Als lebendiges Exemplar entdeckt wurde sie in China in den 1940er Jahren. Bereits zehn Jahre später erhielt die Insel Mainau ihr erstes Exemplar, mit einer Größe von rund 30 cm, vom Königlichen Botanischen Garten „Kew Gardens“ in Richmond, Großbritannien. Dass sich der Baum in seiner neuen Heimat auf der Blumeninsel sofort wohlgefühlt hat, zeigen die aus Stecklingen des Mutterbaums entstandenen 51 Metasequoien.
Heute, über ein halbes Jahrhundert später, umrahmen sie eindrucksvoll und erhaben den Besucherweg zum Schmetterlingshaus. An heißen Tagen spenden sie kühlen Schatten und zeigen frisches Grün im Frühling sowie eine kupferne Färbung im Herbst – die Metasequoia-Allee lädt ein zum Innehalten.
','<div class="col-xs-12 col-md-6">
 <p>
  Sie ist ein lebendes Fossil, unter dem bereits die Dinosaurier wandelten: Metasequoia (auch Chinesisches Rotholz). Als lebendiges Exemplar entdeckt wurde sie in China in den 1940er Jahren. Bereits zehn Jahre später erhielt die Insel Mainau ihr erstes Exemplar, mit einer Größe von rund 30 cm, vom Königlichen Botanischen Garten „Kew Gardens“ in Richmond, Großbritannien. Dass sich der Baum in seiner neuen Heimat auf der Blumeninsel sofort wohlgefühlt hat, zeigen die aus Stecklingen des Mutterbaums entstandenen 51 Metasequoien.
 </p>
 <p>
  Heute, über ein halbes Jahrhundert später, umrahmen sie eindrucksvoll und erhaben den Besucherweg zum Schmetterlingshaus. An heißen Tagen spenden sie kühlen Schatten und zeigen frisches Grün im Frühling sowie eine kupferne Färbung im Herbst – die Metasequoia-Allee lädt ein zum Innehalten.
 </p>
</div>
'),('Schlosskirche St. Marien',47.70466664163888, 9.199601073511158,'schlosskirche-2017.jpg','
Die Schlosskirche St. Marien wurde 1732 bis 1739 ebenfalls von Johann Caspar Bagnato erbaut. Ihre Hauptausstattung – unter anderem Hochaltar, Seitenaltäre, Kanzel und Skulpturen – stammt von einem der bedeutendsten Barockbildhauer des deutschen Südwestens, Joseph Anton Feuchtmeyer (1696-1770).
Deckengemälde und Hochaltarbild von Franz Joseph Spiegler sind dem Leben Mariens gewidmet. Der reiche Stuck von Francesco Pozzi ist mehr als Dekoration – er lenkt den Blick zum Wesentlichen: zum „himmlischen Bereich“ von Chorraum und Hochaltar. Die Kirche ist ein Gesamtkunstwerk, das von der Religiosität seiner Zeit zeugt.
Mit ihr begann der Siegeszug des Barock am Bodensee. Die Kirchenglocke von St. Marien ist eine der wenigen Glocken am Bodensee, die vor dem Dreißigjährigen Krieg entstanden sind. Sie wurde 1505 in Lindau gegossen, hat einen Durchmesser von 54 cm und ist 150 kg schwer.
','<div class="col-xs-12 col-md-6">
 <p>
  Die Schlosskirche St. Marien wurde 1732 bis 1739 ebenfalls von Johann Caspar Bagnato erbaut. Ihre Hauptausstattung – unter anderem Hochaltar, Seitenaltäre, Kanzel und Skulpturen – stammt von einem der bedeutendsten Barockbildhauer des deutschen Südwestens, Joseph Anton Feuchtmeyer (1696-1770).
 </p>
 <p>
  Deckengemälde und Hochaltarbild von Franz Joseph Spiegler sind dem Leben Mariens gewidmet. Der reiche Stuck von Francesco Pozzi ist mehr als Dekoration – er lenkt den Blick zum Wesentlichen: zum „himmlischen Bereich“ von Chorraum und Hochaltar. Die Kirche ist ein Gesamtkunstwerk, das von der Religiosität seiner Zeit zeugt.
 </p>
 <p>
  Mit ihr begann der Siegeszug des Barock am Bodensee. Die Kirchenglocke von St. Marien ist eine der wenigen Glocken am Bodensee, die vor dem Dreißigjährigen Krieg entstanden sind. Sie wurde 1505 in Lindau gegossen, hat einen Durchmesser von 54 cm und ist 150 kg schwer.
 </p>
</div>
'),('Großherzog-Friedrich-Terrasse',47.70522618821534, 9.195072873643849,'event_break_1080x720.jpg','
Am nordwestlichen Rand des Arboretums liegt die Großherzog-Friedrich-Terrasse, die dem Parkgründer Großherzog Friedrich I. von Baden gewidmet ist. Umgeben von symmetrisch angelegten Blumenbeeten steht hier seine marmorne Büste. Im Hintergrund ist das historische Wasserreservoir, das heute zwar nicht mehr in Betrieb ist, von dessen Dachterrasse der Mainau-Besucher aber einen ansprechenden Blick ins Arboretum hat.
','<div class="col-xs-12 col-md-6">
 <p>
  Am nordwestlichen Rand des Arboretums liegt die Großherzog-Friedrich-Terrasse, die dem Parkgründer Großherzog Friedrich I. von Baden gewidmet ist. Umgeben von symmetrisch angelegten Blumenbeeten steht hier seine marmorne Büste. Im Hintergrund ist das historische Wasserreservoir, das heute zwar nicht mehr in Betrieb ist, von dessen Dachterrasse der Mainau-Besucher aber einen ansprechenden Blick ins Arboretum hat.
 </p>
</div>
'),('Platanenweg 5',47.70488685100831, 9.193838409543666,'platanenweg_1080x720-1.jpg','
Es ist ein klangvoller Name - Platanenweg 5. Direkt gegenüber dem Schmetterlingshaus steht ein kleines blaues Holzgartenhaus, inmitten grüner Sträucher und Bäume. Eingefasst wird der Platanenweg 5 von einem weißen Gartenzaun, der diesen Bereich von den anderen Parkbereichen abgrenzt. Dadurch wird die Atmosphäre des eigenen Vorgartens geschaffen, mit Platz für einen kleinen Gartenteich, kleine Wege schlängeln sich durch Blumenwiesen und in den Hecken und Büschen sind kleine Licht- und Dekorationselemente zu entdecken. Erdbeeren aus dem Hängetopf? Hortensienbüsche im Blumenkübel? Der Platanenweg 5 gibt Tipps zu aktuellen Gartentrends. Hier findet jeder Ideen um das eigene Zuhause pflanzlicher zu gestalten.
Verschiedene Partner der Blumeninsel präsentieren sich ebenso in den Gärten rund um den Platanenweg 5: Pflanzungen in Zusammenarbeit mit den Zeitschriften "Mein schöner Garten" sowie "Lisa Blumen und Pflanzen" und ein Glashaus der Firma Beckmann runden die Anlagen ab. 
Außerdem ist dort "Das Grüne Telefon" angesiedelt, die Blumen- und Pflanzenberatung der Mainau-Gärtner zu botanischen Fragen der Besucher.
Öffnungszeiten unserer PflanzenberatungWährend des Blumenjahres täglich im Platanenweg von 10.30 bis 12.30 Uhr und von 13.00 bis 15.00 UhrTelefonisch immer mittwochs von 13.00 bis 16.00 Uhr unter +49 7531 303-333Per E-Mail unter gruenes-telefon@mainau.de
Tipps vom Mainau-Gärtner  Das Grüne Telefon bloggt
 
','<div class="col-xs-12 col-md-6">
 <p>
  Es ist ein klangvoller Name - Platanenweg 5. Direkt gegenüber dem Schmetterlingshaus steht ein kleines blaues Holzgartenhaus, inmitten grüner Sträucher und Bäume. Eingefasst wird der Platanenweg 5 von einem weißen Gartenzaun, der diesen Bereich von den anderen Parkbereichen abgrenzt. Dadurch wird die Atmosphäre des eigenen Vorgartens geschaffen, mit Platz für einen kleinen Gartenteich, kleine Wege schlängeln sich durch Blumenwiesen und in den Hecken und Büschen sind kleine Licht- und Dekorationselemente zu entdecken. Erdbeeren aus dem Hängetopf? Hortensienbüsche im Blumenkübel? Der Platanenweg 5 gibt Tipps zu aktuellen Gartentrends. Hier findet jeder Ideen um das eigene Zuhause pflanzlicher zu gestalten.
 </p>
 <p>
  Verschiedene Partner der Blumeninsel präsentieren sich ebenso in den Gärten rund um den Platanenweg 5: Pflanzungen in Zusammenarbeit mit den Zeitschriften "Mein schöner Garten" sowie "Lisa Blumen und Pflanzen" und ein Glashaus der Firma Beckmann runden die Anlagen ab.
 </p>
 <p>
  Außerdem ist dort "Das Grüne Telefon" angesiedelt, die Blumen- und Pflanzenberatung der Mainau-Gärtner zu botanischen Fragen der Besucher.
 </p>
 <p>
  <strong>
   Öffnungszeiten unserer Pflanzenberatung
  </strong>
  <br/>
  <em>
   Während des Blumenjahres täglich im Platanenweg von 10.30 bis 12.30 Uhr und von 13.00 bis 15.00 Uhr
  </em>
  <br/>
  <em>
   Telefonisch immer mittwochs von 13.00 bis 16.00 Uhr unter +49 7531 303-333
  </em>
  <br/>
  <em>
   Per E-Mail unter gruenes-telefon@mainau.de
  </em>
 </p>
 <p>
  <a class="btn btn-default" href="de/gruenes-telefon-beratung.html" title="Tipps vom Mainau-Gärtner">
   Tipps vom Mainau-Gärtner
  </a>
  <a class="btn btn-primary" href="http://blog.mainau.de/" target="_blank" title="Blog | Das Grüne Telefon">
   Das Grüne Telefon bloggt
  </a>
 </p>
 <p>
 </p>
</div>
'),('Ufergarten',47.7031179297963, 9.200727392825492,'relief_1080x720-1.jpg','
Der Ufergarten liegt an der südöstlichen Spitze der Insel Mainau. Hohe Buchen, Linden und andere Bäume prägen diesen Parkbereich, durch den sich ein langes Blumenband schlängelt. Aufgrund der halbschattigen Lage ist dieser Ort gut geeignet, um die alten und sehr großen Fuchsiensolitäre zu präsentieren. Der Ufergarten ist aber auch Heimat zahlreicher Rhododendronsträucher und ihrer Begleiter sowie von echten Kaelien, die sich hier sehr wohl fühlen. 
Darüber hinaus steht im Ufergarten der erste Urweltmammutbaum der Mainau, der 1952 aus Kew Gardens bei London auf die Insel gekommen und hier ausgepflanzt worden war.
An einem Hang am Rande des Ufergartens haben die Gärtner der Mainau schon vor etlichen Jahren ein Blumenbeet in Form des Bodensees angelegt, das den Mainau-Besucher auf blumige Weise die Geografie des schwäbischen Meeres etwas näher bringt.
 
','<div class="col-xs-12 col-md-6">
 <p>
  Der Ufergarten liegt an der südöstlichen Spitze der Insel Mainau. Hohe Buchen, Linden und andere Bäume prägen diesen Parkbereich, durch den sich ein langes Blumenband schlängelt. Aufgrund der halbschattigen Lage ist dieser Ort gut geeignet, um die alten und sehr großen Fuchsiensolitäre zu präsentieren. Der Ufergarten ist aber auch Heimat zahlreicher Rhododendronsträucher und ihrer Begleiter sowie von echten Kaelien, die sich hier sehr wohl fühlen.
 </p>
 <p>
  Darüber hinaus steht im Ufergarten der erste Urweltmammutbaum der Mainau, der 1952 aus Kew Gardens bei London auf die Insel gekommen und hier ausgepflanzt worden war.
 </p>
 <p>
  An einem Hang am Rande des Ufergartens haben die Gärtner der Mainau schon vor etlichen Jahren ein Blumenbeet in Form des Bodensees angelegt, das den Mainau-Besucher auf blumige Weise die Geografie des schwäbischen Meeres etwas näher bringt.
 </p>
 <p>
 </p>
</div>
'),('Gärtnerturm',47.705031250089846, 9.198656152759554,'attraktion_gaertnerturm-2_1080x720.jpg','
Vis à vis zum Schloss befindet sich der Gärtnerturm. Das massive Untergeschoss des Turms stammt aus dem Mittelalter, erbaut aus Resten der mittelalterlichen Festungsanlage, die sich damals auf der Insel befunden hat. Sein achteckiger Aufbau und das Helmdach sind im 19. Jahrhundert entstanden. Heute beherbergt der Turm einen der Mainau-Souvenirshops sowie wechselnde Ausstellungen über die Familie Bernadotte im Obergeschoss. Ein Besuch lohnt sich allemal, da man vom Gärtnerturm aus einen einzigartigen Blick ins Arboretum und auf Schloss Mainau hat.
','<div class="col-xs-12 col-md-6">
 <p>
  Vis à vis zum Schloss befindet sich der Gärtnerturm. Das massive Untergeschoss des Turms stammt aus dem Mittelalter, erbaut aus Resten der mittelalterlichen Festungsanlage, die sich damals auf der Insel befunden hat. Sein achteckiger Aufbau und das Helmdach sind im 19. Jahrhundert entstanden.
  <br/>
  <br/>
  Heute beherbergt der Turm einen der Mainau-Souvenirshops sowie wechselnde Ausstellungen über die Familie Bernadotte im Obergeschoss. Ein Besuch lohnt sich allemal, da man vom Gärtnerturm aus einen einzigartigen Blick ins Arboretum und auf Schloss Mainau hat.
 </p>
</div>
'),('Sonja und Lennart Bernadotte Platz',47.705208138419536, 9.198887532666308,'attraktion_bernadotteplatz-1_1080x720.jpg','
Zum Blumenjahr 2009 gestalteten die Mainauer zu Ehren ihrer ehemaligen Inselherrin Gräfin Sonja (†2008) und ihres ehemaligen Inselherrn Graf Lennart Bernadotte (†2004) den „Sonja und Lennart Bernadotte-Platz“. 
Für Graf Lennart war die Insel Mainau sein erstes richtiges Zuhause. Immer wenn die Familie Bernadotte von einer längeren Reise zurückkam, wollte Graf Lennart nach dem Passieren des Gärtnerturms anhalten, um das Schloss zu betrachten, das ihn mit seinen zwei Flügeln wie mit offenen Armen begrüßte. Somit wurde der Platz neben dem Torbogenhaus für die gesamte Familie zu einem Ort mit einer ganz besonderen Bedeutung. Aus diesem Grund wurde bereits nach dem Tod von Graf Lennart eine Büste an seinem Lieblingsplatz aufgestellt, mit Blick in Richtung der „offenen Arme“ des Schlosses.
Der Sonja und Lennart Bernadotte Platz lädt ein, ein paar ruhige Momente  zu verbringen und diesen optischen Eindruck auf sich wirken lassen können. Auf dem Platz gibt es Stelen, auf denen wichtige Stationen im Leben des Paares beschrieben werden. Viele dieser Stationen sind mit der Insel Mainau verbunden. Die Graf Lennart-Büste (geschaffen von Marianne Kieselbach) wird gemeinsam mit einer neu gegossenen Gräfin Sonja-Büste (geschaffen von Waldemar Schröder) mit Blick auf das Schloss in den Platz integriert.
','<div class="col-xs-12 col-md-6">
 <p>
  Zum Blumenjahr 2009 gestalteten die Mainauer zu Ehren ihrer ehemaligen Inselherrin Gräfin Sonja (†2008) und ihres ehemaligen Inselherrn Graf Lennart Bernadotte (†2004) den „Sonja und Lennart Bernadotte-Platz“.
 </p>
 <p>
  Für Graf Lennart war die Insel Mainau sein erstes richtiges Zuhause. Immer wenn die Familie Bernadotte von einer längeren Reise zurückkam, wollte Graf Lennart nach dem Passieren des Gärtnerturms anhalten, um das Schloss zu betrachten, das ihn mit seinen zwei Flügeln wie mit offenen Armen begrüßte. Somit wurde der Platz neben dem Torbogenhaus für die gesamte Familie zu einem Ort mit einer ganz besonderen Bedeutung. Aus diesem Grund wurde bereits nach dem Tod von Graf Lennart eine Büste an seinem Lieblingsplatz aufgestellt, mit Blick in Richtung der „offenen Arme“ des Schlosses.
 </p>
 <p>
  Der Sonja und Lennart Bernadotte Platz lädt ein, ein paar ruhige Momente  zu verbringen und diesen optischen Eindruck auf sich wirken lassen können. Auf dem Platz gibt es Stelen, auf denen wichtige Stationen im Leben des Paares beschrieben werden. Viele dieser Stationen sind mit der Insel Mainau verbunden. Die Graf Lennart-Büste (geschaffen von Marianne Kieselbach) wird gemeinsam mit einer neu gegossenen Gräfin Sonja-Büste (geschaffen von Waldemar Schröder) mit Blick auf das Schloss in den Platz integriert.
 </p>
</div>
'),('Torbogengebäude',47.70552220397486, 9.198967452402218,'torbogen_1080x720.jpg','
Am Zugang zum Schlossbereich steht das Torhaus. Es wurde vermutlich von Franz Anton Bagnato erbaut, dem Sohn des Schlossbaumeisters. Die Jahreszahl 1764 und das Wappen des Landkomturs Graf Königsegg lassen diese Vermutung zu. Der klassizistische Anbau stammt aus dem 19. Jahrhundert. Direkt vor dem Gebäude verlief früher der Burggraben. Heute beherbergt es Teile der Mainau-Verwaltung sowie das Mainau-Servicezentrum. Hier stehen Broschüren zur Mainau und Bodenseeregion bereit.
','<div class="col-xs-12 col-md-6">
 <p>
  Am Zugang zum Schlossbereich steht das Torhaus. Es wurde vermutlich von Franz Anton Bagnato erbaut, dem Sohn des Schlossbaumeisters. Die Jahreszahl 1764 und das Wappen des Landkomturs Graf Königsegg lassen diese Vermutung zu. Der klassizistische Anbau stammt aus dem 19. Jahrhundert. Direkt vor dem Gebäude verlief früher der Burggraben. Heute beherbergt es Teile der Mainau-Verwaltung sowie das Mainau-Servicezentrum. Hier stehen Broschüren zur Mainau und Bodenseeregion bereit.
 </p>
</div>
'),('Rhododendronhang',47.703565580837434, 9.200760108965051,'rhododendron_1080x720-1.jpg','
Im Schatten herrlicher Bäume verwandeln im Mai und teilweise Juni annähernd 230 Rhododendron-Sorten den Osthang der Insel Mainau in ein buntes Blumenmeer am Osthang. Die Anlage im Uferbereich, durch die der Rhododendronweg führt, umfasst auf etwa 3.000 qm alle erdenklichen Formen von Rhododendren, von den flach wachsenden, zwergigen über die starkwüchsigen mit enormen Einzelblüten bis hin zu den filigranen, sommergrünen, kleinblumigen Arten, die gewöhnlich als Azaleen bezeichnet werden.
Die hohe Luftfeuchtigkeit des Bodensees lässt die größtenteils immergrünen Sträucher besonders gut gedeihen. Vorteilhaft ist des Weiteren der Halbschatten durch die großen Scheinzypressen, Lebensbäume und mächtigen Laubbäume wie Buchen und Linden.
Zu den farbigen Botschaftern Asiens zählen neben verbreiteten auch ausgefallene und Liebhabersorten zum Bestand. Viele Rhododendren sind zu hohen, fast baumartigen Sträuchern herangewachsen. Zusammen bilden sie ein Farbensemble mit enormer optischer Tiefe und großartiger, gestalterischer Wirkung.
','<div class="col-xs-12 col-md-6">
 <p>
  Im Schatten herrlicher Bäume verwandeln im Mai und teilweise Juni annähernd 230 Rhododendron-Sorten den Osthang der Insel Mainau in ein buntes Blumenmeer am Osthang. Die Anlage im Uferbereich, durch die der Rhododendronweg führt, umfasst auf etwa 3.000 qm alle erdenklichen Formen von Rhododendren, von den flach wachsenden, zwergigen über die starkwüchsigen mit enormen Einzelblüten bis hin zu den filigranen, sommergrünen, kleinblumigen Arten, die gewöhnlich als Azaleen bezeichnet werden.
 </p>
 <p>
  Die hohe Luftfeuchtigkeit des Bodensees lässt die größtenteils immergrünen Sträucher besonders gut gedeihen. Vorteilhaft ist des Weiteren der Halbschatten durch die großen Scheinzypressen, Lebensbäume und mächtigen Laubbäume wie Buchen und Linden.
 </p>
 <p>
  Zu den farbigen Botschaftern Asiens zählen neben verbreiteten auch ausgefallene und Liebhabersorten zum Bestand. Viele Rhododendren sind zu hohen, fast baumartigen Sträuchern herangewachsen. Zusammen bilden sie ein Farbensemble mit enormer optischer Tiefe und großartiger, gestalterischer Wirkung.
 </p>
</div>
'),('Insektengarten',47.70484353120589, 9.194304916709042,'insektengarten_1080x720-1.jpg','
Mit dem Insektengarten möchte die Insel Mainau über die Bedeutung der Bienen, ihre Lebensweise, ihre Kulturgeschichte, aber auch über die Gefahren, die ihr drohen, informieren und ihre Besucher für diese Themenstellungen sensibilisieren.
Dieser Bereich der Insel mit seinen vielseitigen Informationen bildet einen harmonischen Übergang zwischen dem gartenkulturell geprägten Areal des Informationsgartens „Platanenweg 5“ und den eher landwirtschaftlich geprägten Partien des Weinbergs sowie der angrenzenden Obstbaufläche und lädt zum Entdecken ein. 
Doch soll der Mainau-Besucher nicht nur informiert werden, sondern darüber hinaus das Tier Biene fühlen, spüren und aktiv erleben. Aus diesem Grund wird unter anderem ein begehbarer Baumstamm aufgestellt, in dessen oberem Bereich ein Bienenvolk wohnt und nur durch ein Netz vom Besucher getrennt ist. Somit können Geräusche und Gerüche des Bienenvolks intensiv erfahren werden.
Pflanzen, die von Bienen, aber auch von vielen anderen Insekten bevorzugt angeflogen werden, weil sie viel Nektar oder Pollen bieten,  bezeichnet man als Trachtpflanzen. Hierzu gehören nicht nur heimische Wildpflanzen und landwirtschaftliche Kulturarten wie Obst, Sonnenblumen oder Raps, auch viele Zierarten der Gärten haben einen Wert als Insektenfutterpflanze. Da heimische Pflanzen und Obstgehölze vor allem im Frühjahr blühen, können gerade später im Jahr Gartenpflanzen einen durchaus wichtigen Beitrag zur Versorgung der Insekten leisten. Neben Wiesenpflanzen und Sommerblumen zählen dazu auch beliebte Gartenstauden wie Astern, Katzenminze und Zierlauch.
','<div class="col-xs-12 col-md-6">
 <p>
  Mit dem Insektengarten möchte die Insel Mainau über die Bedeutung der Bienen, ihre Lebensweise, ihre Kulturgeschichte, aber auch über die Gefahren, die ihr drohen, informieren und ihre Besucher für diese Themenstellungen sensibilisieren.
 </p>
 <p>
  Dieser Bereich der Insel mit seinen vielseitigen Informationen bildet einen harmonischen Übergang zwischen dem gartenkulturell geprägten Areal des Informationsgartens „Platanenweg 5“ und den eher landwirtschaftlich geprägten Partien des Weinbergs sowie der angrenzenden Obstbaufläche und lädt zum Entdecken ein.
 </p>
 <p>
  Doch soll der Mainau-Besucher nicht nur informiert werden, sondern darüber hinaus das Tier Biene fühlen, spüren und aktiv erleben. Aus diesem Grund wird unter anderem ein begehbarer Baumstamm aufgestellt, in dessen oberem Bereich ein Bienenvolk wohnt und nur durch ein Netz vom Besucher getrennt ist. Somit können Geräusche und Gerüche des Bienenvolks intensiv erfahren werden.
 </p>
 <p>
  Pflanzen, die von Bienen, aber auch von vielen anderen Insekten bevorzugt angeflogen werden, weil sie viel Nektar oder Pollen bieten,  bezeichnet man als Trachtpflanzen. Hierzu gehören nicht nur heimische Wildpflanzen und landwirtschaftliche Kulturarten wie Obst, Sonnenblumen oder Raps, auch viele Zierarten der Gärten haben einen Wert als Insektenfutterpflanze. Da heimische Pflanzen und Obstgehölze vor allem im Frühjahr blühen, können gerade später im Jahr Gartenpflanzen einen durchaus wichtigen Beitrag zur Versorgung der Insekten leisten. Neben Wiesenpflanzen und Sommerblumen zählen dazu auch beliebte Gartenstauden wie Astern, Katzenminze und Zierlauch.
 </p>
</div>
'),('Mainau-Bauernhof',47.70365944266499, 9.194020884272312,'mainau-bauernhof.jpg','
Die wenigsten Kinder kennen heutzutage grasende Kühe, meckernde Ziegen oder gackernde Hennen aus nächster Nähe. Umso größer die Begeisterung wenn sie die Mainau-Tiere entdecken. Im großzügig angelegten Tiergehege gibt es alte Haustierrassen wie Ponys, Zwergesel und Rinder; im Mainau-Bauernhof mit Bauerngarten tummeln sich Hühner und Kaninchen, und im Streichelzoo ist Streicheln ausdrücklich erlaubt – den Ziegen gefällt’s.
Der Bauernhof bietet:
Unsere Bauernhof-BewohnerIm Mainauer Bauernhof wohnen Alpakas, Hasen, Hühner, Ziegen, Shetland-Ponys, Esel, Schafe und Katzen.StreichelzooEin Teil des Ziegengeheges ist für Euch zugänglich und die Ziegen freuen sich darauf, gestreichelt zu werden.Seltene HaustierrassenZu sehen sind die braunen Bergschafe und die Hühner der Rasse „Vorwerkhühner“, die vom Aussterben bedrohte Haustierrassen sind.BauerngartenZu einem Bauernhof gehört auch ein Bauerngarten! Dieser befindet sich in Mitten der Tiergehege vor dem Stall. Hier werden Nutzpflanzen wie Salat, Kräuter, Obst und Gemüse kultiviert.Der Streichelzoo in den WintermonatenLaut behördlicher Auflagen müssen wir in unmittelbarer Nähe zu unserem Streichelzoo eine Handwaschmöglichkeit zur Verfügung stellen. Da jedoch die Wasserleitungen für das Waschbecken im Winter einfrieren und Schaden nehmen würden, müssen wir während dieser Zeit das Wasser abstellen. Dies hat zur Folge, dass das Gehege des Streichelzoos leider in den Wintermonaten geschlossen bleiben muss. Die Tiere sind natürlich trotzdem in ihren Gehegen unterwegs und können von unseren Besuchern beobachtet werden. Wir danken Ihnen für Ihr Verständnis.
','<div class="col-xs-12 col-md-6">
 <p>
  Die wenigsten Kinder kennen heutzutage grasende Kühe, meckernde Ziegen oder gackernde Hennen aus nächster Nähe. Umso größer die Begeisterung wenn sie die Mainau-Tiere entdecken. Im großzügig angelegten Tiergehege gibt es alte Haustierrassen wie Ponys, Zwergesel und Rinder; im Mainau-Bauernhof mit Bauerngarten tummeln sich Hühner und Kaninchen, und im Streichelzoo ist Streicheln ausdrücklich erlaubt – den Ziegen gefällt’s.
 </p>
 <p>
  Der Bauernhof bietet:
 </p>
 <p>
  <strong>
   Unsere Bauernhof-Bewohner
  </strong>
  <br/>
  Im Mainauer Bauernhof wohnen Alpakas, Hasen, Hühner, Ziegen, Shetland-Ponys, Esel, Schafe und Katzen.
  <br/>
  <br/>
  <strong>
   Streichelzoo
  </strong>
  <br/>
  Ein Teil des Ziegengeheges ist für Euch zugänglich und die Ziegen freuen sich darauf, gestreichelt zu werden.
  <br/>
  <br/>
  <strong>
   Seltene Haustierrassen
  </strong>
  <br/>
  Zu sehen sind die braunen Bergschafe und die Hühner der Rasse „Vorwerkhühner“, die vom Aussterben bedrohte Haustierrassen sind.
  <br/>
  <br/>
  <strong>
   Bauerngarten
  </strong>
  <br/>
  Zu einem Bauernhof gehört auch ein Bauerngarten! Dieser befindet sich in Mitten der Tiergehege vor dem Stall. Hier werden Nutzpflanzen wie Salat, Kräuter, Obst und Gemüse kultiviert.
  <br/>
  <br/>
  <strong>
   Der Streichelzoo in den Wintermonaten
  </strong>
  <br/>
  Laut behördlicher Auflagen müssen wir in unmittelbarer Nähe zu unserem Streichelzoo eine Handwaschmöglichkeit zur Verfügung stellen. Da jedoch die Wasserleitungen für das Waschbecken im Winter einfrieren und Schaden nehmen würden, müssen wir während dieser Zeit das Wasser abstellen. Dies hat zur Folge, dass das Gehege des Streichelzoos leider in den Wintermonaten geschlossen bleiben muss. Die Tiere sind natürlich trotzdem in ihren Gehegen unterwegs und können von unseren Besuchern beobachtet werden. Wir danken Ihnen für Ihr Verständnis.
 </p>
</div>
'),('Mainau Kinderland',47.7041359693363, 9.191927628730971,'spielplatz_1080x720-1.jpg','
Die „Wasserwelt“ im Mainau-Kinderland ist ein Spielbereich, der die Bodenseeregion vergangener Zeiten widerspiegeln soll. Um einen See, in dessen Mitte sich eine Insel befindet, gruppiert sich eine Pfahlbausiedlung. Kleine Häuser und Türme schmiegen sich eng aneinander und sind auf unterschiedliche Weise miteinander verbunden. So ist es möglich, sich über Hängebrücken oder Kettenstege von einem Haus zum nächsten zu hangeln, ohne den Boden zu berühren. Von einer Seeseite zur anderen gelangen die Kinder mit Seilfähre oder Flößen. Der Spielplatz hat eine Gesamtgröße von 1100 Quadratmeter. Tipp: Für nasse Kleidung steht am Eisstand „Eisbrecher“ ein Trockner zur Verfügung.
Der Themenspielplatz „Blumis Uferwelt“ für 3 bis 6-jährige bietet viel Platz für den Bewegungs- und Entdeckungsdrang der Kinder: Eine realistisch nachempfundene Uferlandschaft mit Treibholz, Kletternetzen und Balancierbalken, Biberbauten zum Entdecken und Verstecken und Vieles mehr. Hier wird die Motorik der Kinder speziell gefordert und gefördert, jedoch auf eine ganz natürliche und spielerische Art und Weise. Der zweite Teil der neuen Spiellandschaft widmet sich der Phänomenologie, einem Forschungsbereich, speziell für Kinder. Einzelne Räume laden zum Staunen, Erleben und Forschen ein.
Das „Zwergendorf“ mit einer Vielfalt an schönen Spielgelegenheiten wurde speziell für Kinder zwischen eins und vier konzipiert. Hier gibt es verschiedene Spielbereiche: Höhlenartige Hütten, Holzeisenbahn und Wasserspielzonen lassen das Herz der Kinder höher schlagen.
','<div class="col-xs-12 col-md-6">
 <p>
  Die „Wasserwelt“ im Mainau-Kinderland ist ein Spielbereich, der die Bodenseeregion vergangener Zeiten widerspiegeln soll. Um einen See, in dessen Mitte sich eine Insel befindet, gruppiert sich eine Pfahlbausiedlung. Kleine Häuser und Türme schmiegen sich eng aneinander und sind auf unterschiedliche Weise miteinander verbunden. So ist es möglich, sich über Hängebrücken oder Kettenstege von einem Haus zum nächsten zu hangeln, ohne den Boden zu berühren. Von einer Seeseite zur anderen gelangen die Kinder mit Seilfähre oder Flößen. Der Spielplatz hat eine Gesamtgröße von 1100 Quadratmeter. Tipp: Für nasse Kleidung steht am Eisstand „Eisbrecher“ ein Trockner zur Verfügung.
 </p>
 <p>
  Der Themenspielplatz „Blumis Uferwelt“ für 3 bis 6-jährige bietet viel Platz für den Bewegungs- und Entdeckungsdrang der Kinder: Eine realistisch nachempfundene Uferlandschaft mit Treibholz, Kletternetzen und Balancierbalken, Biberbauten zum Entdecken und Verstecken und Vieles mehr. Hier wird die Motorik der Kinder speziell gefordert und gefördert, jedoch auf eine ganz natürliche und spielerische Art und Weise. Der zweite Teil der neuen Spiellandschaft widmet sich der Phänomenologie, einem Forschungsbereich, speziell für Kinder. Einzelne Räume laden zum Staunen, Erleben und Forschen ein.
 </p>
 <p>
  Das „Zwergendorf“ mit einer Vielfalt an schönen Spielgelegenheiten wurde speziell für Kinder zwischen eins und vier konzipiert. Hier gibt es verschiedene Spielbereiche: Höhlenartige Hütten, Holzeisenbahn und Wasserspielzonen lassen das Herz der Kinder höher schlagen.
 </p>
</div>
'),('Schwedenturm',47.70407459872149, 9.195646038119648,'attraktion_schwedenturm_1080x720-2.jpg','
Der Schwedenturm prägt das Bild der Insel und hat sich zu einem Wahrzeichen der Blumeninsel entwickelt. Das hat er nicht zuletzt seiner majestätischen Lage am Südwesthang der Insel zu verdanken. Dort thront er hoch oben über den Weinreben und überblickt die Insel. Die Bezeichnung Schwedenturm stammt aus der zweijährigen Besetzungszeit der Schweden auf der Insel. Erbaut wurde er jedoch bereits zur Zeit des Deutschen Ordens, wie die Jahreszahl 1558 und das Wappen des Deutschen Ordens über der Eingangstür belegen. Ursprünglich als Wachturm genutzt, ist sein Innenraum heute nicht mehr frei zugänglich.
','<div class="col-xs-12 col-md-6">
 <p>
  Der Schwedenturm prägt das Bild der Insel und hat sich zu einem Wahrzeichen der Blumeninsel entwickelt. Das hat er nicht zuletzt seiner majestätischen Lage am Südwesthang der Insel zu verdanken. Dort thront er hoch oben über den Weinreben und überblickt die Insel. Die Bezeichnung Schwedenturm stammt aus der zweijährigen Besetzungszeit der Schweden auf der Insel. Erbaut wurde er jedoch bereits zur Zeit des Deutschen Ordens, wie die Jahreszahl 1558 und das Wappen des Deutschen Ordens über der Eingangstür belegen. Ursprünglich als Wachturm genutzt, ist sein Innenraum heute nicht mehr frei zugänglich.
 </p>
</div>
'),('Schwedenkreuz',47.70271937286347, 9.186746992359557,'schwedenkreuz_1080x720-1.jpg.jpg','
Seit einigen Jahrhunderten schmückt das Schwedenkreuz den Uferbereich zwischen der Insel und dem Festland und heißt die Mainau-Besucher willkommen. Zurückzuführen ist der Name des Kreuzes auf die schwedische Herrschaftszeit während des 30-jährigen Krieges (1618-1648) auf der Insel Mainau. Wie es den Weg an seinen heutigen Platz gefunden hat, geht aus einer Legende hervor. Demzufolge plünderten die Schweden nach Ende ihrer zweijährigen Regentschaft die Insel. Teil der Ausbeute war unter anderem die bronzene Kreuzigungsgruppe. Diese stellte sich jedoch als so schwer heraus, dass die schwedischen Truppen sie an ihrem heutigen Platz zurücklassen mussten.
','<div class="col-xs-12 col-md-6">
 <p>
  Seit einigen Jahrhunderten schmückt das Schwedenkreuz den Uferbereich zwischen der Insel und dem Festland und heißt die Mainau
  <strong>
   -
  </strong>
  Besucher willkommen. Zurückzuführen ist der Name des Kreuzes auf die schwedische Herrschaftszeit während des 30-jährigen Krieges (1618-1648) auf der Insel Mainau. Wie es den Weg an seinen heutigen Platz gefunden hat, geht aus einer Legende hervor. Demzufolge plünderten die Schweden nach Ende ihrer zweijährigen Regentschaft die Insel. Teil der Ausbeute war unter anderem die bronzene Kreuzigungsgruppe. Diese stellte sich jedoch als so schwer heraus, dass die schwedischen Truppen sie an ihrem heutigen Platz zurücklassen mussten.
 </p>
</div>
'),('Schlosscafé',47.70475328150181, 9.199964986243186,'schlosscafe_1080x720-3.jpg','
Öffnungszeiten SchlosscaféBis 31.3.: täglich geöffnet von 11.00 bis 17.00 Uhr.Ab 1.4.: 11.00 bis 17.00 Uhr, Freitag Ruhetag
Werfen Sie einen Blick in unsere Speise- und Getränkekarte*:*Änderungen vorbehalten
Speise- und Getränkekarte Schlosscafé
In gepflegtem Ambiente zwischen Palmenhaus und Schlossausstellung bieten wir Ihnen einen ganz besonderen Platz zum Verweilen bei Naschereien aus regionaler Herstellung sowie einer beachtlichen Auswahl an Kaffee- und Teespezialitäten.Wir haben uns auf Kaffee, Kuchen, Torten und Eis spezialisiert und können Ihnen mit Stolz über 40 internationale Kaffeespezialitäten wie zum Beispiel einen "Kapuziner", einen "Cafezinho do Brazil" oder einen "Fliegenden Holländer" anbieten. Überdies bieten wir über zehn verschiedene Eiskaffeespezialitäten an, darunter Besonderheiten wie zum Beispiel einen "Mozart-Eiskaffee".Für Teegenießer haben wir eine große Auswahl an Teespezialitäten, die das Herz von Teeliebhabern und -kennern im Kännchen höher schlagen lassen werden. Für alle anderen Genießer haben wir Kakao- und Trinkschokoladen-Spezialitäten, sowie alkoholfreie Erfrischungs- getränke, exquisite Säfte, Biobiere, Weine, Aperitifs und Sekte sowie Brände von der Insel Mainau und andere Spirituosen und Liköre.Wir nehmen keine Reservierungen vor.
Wie hat es Ihnen bei uns im Schlosscafé gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen
Übrigens:Sie planen einen besonderen Anlass im kleinen Rahmen und suchen dafür eine exklusive Räumlichkeit? Dann buchen Sie exklusiv das Schlosscafé für Ihre Feier, Lesung, Theaterstück etc. bis max. 60 Personen. Gerne unterstützen wir Sie auch bei der Organisation und Durchführung eines passenden Caterings. Sprechen Sie unser Bankettbüro unter +49 (0) 7531 303-156 an.  ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten Schlosscafé
   </strong>
   <br/>
   Bis 31.3.: täglich geöffnet von 11.00 bis 17.00 Uhr.
   <br/>
  </span>
  <span class="fehler">
   Ab 1.4.: 11.00 bis 17.00 Uhr, Freitag Ruhetag
  </span>
 </p>
 <h5>
  Werfen Sie einen Blick in unsere Speise- und Getränkekarte*:
  <br/>
  <sub>
   <em>
    <span class="hinweis">
     *Änderungen vorbehalten
    </span>
   </em>
  </sub>
 </h5>
 <p style="text-align: left;">
  <a class="btn btn-primary" href="https://bit.ly/37Hhk5m" rel="noopener" target="_blank" title="Speise- und Getränkekarte Schlosscafé">
   Speise- und Getränkekarte Schlosscafé
  </a>
 </p>
 <p style="text-align: left;">
  In gepflegtem Ambiente zwischen Palmenhaus und Schlossausstellung bieten wir Ihnen einen ganz besonderen Platz zum Verweilen bei Naschereien aus regionaler Herstellung sowie einer beachtlichen Auswahl an Kaffee- und Teespezialitäten.
  <br/>
  <br/>
  Wir haben uns auf Kaffee, Kuchen, Torten und Eis spezialisiert und können Ihnen mit Stolz über 40 internationale Kaffeespezialitäten wie zum Beispiel einen "Kapuziner", einen "Cafezinho do Brazil" oder einen "Fliegenden Holländer" anbieten. Überdies bieten wir über zehn verschiedene Eiskaffeespezialitäten an, darunter Besonderheiten wie zum Beispiel einen "Mozart-Eiskaffee".
  <br/>
  <br/>
  Für Teegenießer haben wir eine große Auswahl an Teespezialitäten, die das Herz von Teeliebhabern und -kennern im Kännchen höher schlagen lassen werden. Für alle anderen Genießer haben wir Kakao- und Trinkschokoladen-Spezialitäten, sowie alkoholfreie Erfrischungs- getränke, exquisite Säfte, Biobiere, Weine, Aperitifs und Sekte sowie Brände von der Insel Mainau und andere Spirituosen und Liköre.
  <br/>
  <br/>
  <em>
   Wir nehmen keine Reservierungen vor.
  </em>
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Schlosscafé gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473129X101664167X66951" rel="noopener" target="_blank" title="Umfrage Schlosscafé 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
 <p>
  <strong>
   Übrigens:
   <br/>
  </strong>
  <em>
   Sie planen einen besonderen Anlass im kleinen Rahmen und suchen dafür eine exklusive Räumlichkeit? Dann buchen Sie exklusiv das Schlosscafé für Ihre Feier, Lesung, Theaterstück etc. bis max. 60 Personen. Gerne unterstützen wir Sie auch bei der Organisation und Durchführung eines passenden Caterings. Sprechen Sie unser Bankettbüro unter +49 (0) 7531 303-156 an.
  </em>
 </p>
</div>
'),('Schwedenschenke',47.70579294862444, 9.198275667851453,'schwedenschenke_1080x720-1.jpg','
Öffnungszeiten Restaurant SchwedenschenkeMittwoch bis Sonntag 11.00 bis 17.00 Uhr, Montag & Dienstag Ruhetage
 
Speisekarte (gültig ab 17.03.23)
Guten Appetit! Die Schwedenschenke ist die traditionsreichste Gaststätte auf der Insel Mainau, die ihre Gäste im schwedischen Landhausstil willkommen heißt.
Das Ambiente ist gemütlich, die große Terrasse mit überdachten Arkaden bringt südliches Flair. Genießen Sie im Takt der Jahreszeiten unsere kulinarische Kreativität: hochwertige badische und internationale Küche mit Produkten aus der Region, sowie einer großen Vielfalt an regionalen Weinen. Die Schwedenschenke hat auch vegane Gerichte im Angebot.
Wie hat es Ihnen bei uns in der Schwedenschenke gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten Restaurant Schwedenschenke
   </strong>
   <br/>
   Mittwoch bis Sonntag 11.00 bis 17.00 Uhr, Montag &amp; Dienstag Ruhetage
  </span>
 </p>
 <p style="text-align: center;">
 </p>
 <p>
  <a class="btn btn-default" href="https://bit.ly/3JK4rMA" rel="noopener" target="_blank" title="Mittagskarte Schwedenschenke | Insel Mainau">
   Speisekarte (gültig ab 17.03.23)
  </a>
 </p>
 <p style="text-align: left;">
  Guten Appetit! Die Schwedenschenke ist die traditionsreichste Gaststätte auf der Insel Mainau, die ihre Gäste im schwedischen Landhausstil willkommen heißt.
 </p>
 <p class="bodytext">
  Das Ambiente ist gemütlich, die große Terrasse mit überdachten Arkaden bringt südliches Flair. Genießen Sie im Takt der Jahreszeiten unsere kulinarische Kreativität: hochwertige badische und internationale Küche mit Produkten aus der Region, sowie einer großen Vielfalt an regionalen Weinen. Die Schwedenschenke hat auch vegane Gerichte im Angebot.
  <br/>
  <em>
   <br/>
  </em>
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns in der Schwedenschenke gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473134X101664327X10654" rel="noopener" target="_blank" title="Umfrage Schwedenschenke 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
</div>
'),('Bäckerei &quot;Täglich Brot&quot;',47.70529116742851, 9.200597610067433,'gastro_brot-4_1080x720.jpg','
Öffnungszeiten17. März bis 31. März: 11.00 bis 16.00 Uhr1. April bis 1. Oktober: 10.00 Bis 17.00 Uhr2. bis 22. Oktober: 11.00 bis 16.00 UhrMittwoch & Donnerstag Ruhetag
Speisekarte herunterladen
Der verführerische Duft von selbstgebackenem Brot heißt Sie herzlich in unserer Insel-Bäckerei "Täglich Brot" willkommen. Täglich werden rund 300 Laibe Mainau-Brot gebacken, das Sie mit frischen Aufstrichen und einer extravaganten Schinkenvariation genießen können.
Brot zum Erleben - seien Sie dabei, wenn in unserer Schaubäckerei aus Biovollkornmehl, biologischem Sauerteiganteil, Biohefe und Bodenseewasser das Mainau-Brot angesetzt wird. Verfolgen Sie jeden Arbeitsschritt mit und seien Sie gespannt, wenn unser Bäcker-Team das 500 Gramm schwere Ergebnis aus dem rustikalen Holzofen hervorzaubert.
Was Sie im "Täglich Brot" außerdem erwartet:

Verschiedene Dinnele-Variationen aus dem Holzofen
Saisonale Kuchen, z.B. Apfel-Mandel-Kuchen, Rhabarberkuchen mit Streußel, verschiedene Obstkuchen
Belegte Brote mit hauseigenem Brotaufstrich

Auch unseren kleinen Gäste werden begeistert sein: Neben der Schaubäckerei lädt unsere Kinderecke zum Spielen und Verweilen ein. Obendrein bieten wir für die kleinen Leckermäuler Dinnele mit Äpfeln und Zimt an.
Wie hat es Ihnen bei uns im Täglich Brot gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten
   </strong>
   <br/>
   17. März bis 31. März: 11.00 bis 16.00 Uhr
   <br/>
   1. April bis 1. Oktober: 10.00 Bis 17.00 Uhr
   <br/>
   2. bis 22. Oktober: 11.00 bis 16.00 Uhr
   <br/>
   Mittwoch &amp; Donnerstag Ruhetag
  </span>
 </p>
 <p style="text-align: left;">
  <a class="btn btn-default" href="https://bit.ly/3YWEIF5" rel="noopener" target="_blank" title="Speisekarte Täglich Brot herunterladen">
   Speisekarte herunterladen
  </a>
 </p>
 <p style="text-align: left;">
  Der verführerische Duft von selbstgebackenem Brot heißt Sie herzlich in unserer Insel-Bäckerei "Täglich Brot" willkommen. Täglich werden rund 300 Laibe Mainau-Brot gebacken, das Sie mit frischen Aufstrichen und einer extravaganten Schinkenvariation genießen können.
 </p>
 <p>
  Brot zum Erleben - seien Sie dabei, wenn in unserer Schaubäckerei aus Biovollkornmehl, biologischem Sauerteiganteil, Biohefe und Bodenseewasser das Mainau-Brot angesetzt wird. Verfolgen Sie jeden Arbeitsschritt mit und seien Sie gespannt, wenn unser Bäcker-Team das 500 Gramm schwere Ergebnis aus dem rustikalen Holzofen hervorzaubert.
 </p>
 <p>
  Was Sie im "Täglich Brot" außerdem erwartet:
 </p>
 <ul>
  <li>
   Verschiedene Dinnele-Variationen aus dem Holzofen
  </li>
  <li>
   Saisonale Kuchen, z.B. Apfel-Mandel-Kuchen, Rhabarberkuchen mit Streußel, verschiedene Obstkuchen
  </li>
  <li>
   Belegte Brote mit hauseigenem Brotaufstrich
  </li>
 </ul>
 <p>
  Auch unseren kleinen Gäste werden begeistert sein: Neben der Schaubäckerei lädt unsere Kinderecke zum Spielen und Verweilen ein. Obendrein bieten wir für die kleinen Leckermäuler Dinnele mit Äpfeln und Zimt an.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Täglich Brot gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473131X101664309X69944" rel="noopener" target="_blank" title="Umfrage Täglich Brot 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
</div>
'),('Rothaus-Seeterrassen',47.70404571840718, 9.190349661576827,'rosete_1080x720-1.jpg','
Öffnungszeiten Rothaus Seeterrassen17. März bis 31. Mai: 9.00 bis 18.00 Uhr1. Juni bis 10. September: 9.00 bis 20.00 Uhr11. September bis 5. November: 9.00 bis 18.00 Uhr
Der moderne Holz-Glasbau bietet eine angenehme Atmosphäre mit schönem Ausblick auf das Mainau Kinderland und den Bodensee. Das Angebot reicht von belegten Brötchen über ein reichhaltiges Mittagsangebot bis hin zu einer feinen Kaffee- und Kuchenauswahl am Nachmittag.
An sonnigen Tagen ein echter Geheimtipp: die große Seeterrasse direkt am Wasser mit traumhaftem Blick auf den Bodensee. Die Seeterrassen sind ein herrlicher Ort, um die sommerlichen Sonnenstrahlen zu genießen.
Wie hat es Ihnen bei uns in den Rothaus Seeterrassen gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen
Übrigens:Sie lieben BBQ und lauschige Sommerabende mit Familie und Freunden? Dann buchen Sie die Rothaus-Seeterrassen in den Abendstunden für Ihre Feier bis max. 60 Personen und genießen Sie gemeinsam die stimmungsvolle Atmosphäre der Insel Mainau bei Sonnenuntergang. Reservierungen nimmt gerne unser Bankettbüro unter +49 (0) 7531 303-156 entgegen. ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten Rothaus Seeterrassen
   </strong>
   <br/>
   17. März bis 31. Mai: 9.00 bis 18.00 Uhr
   <br/>
   1. Juni bis 10. September: 9.00 bis 20.00 Uhr
   <br/>
   11. September bis 5. November: 9.00 bis 18.00 Uhr
  </span>
 </p>
 <p class="bodytext">
  Der moderne Holz-Glasbau bietet eine angenehme Atmosphäre mit schönem Ausblick auf das Mainau Kinderland und den Bodensee. Das Angebot reicht von belegten Brötchen über ein reichhaltiges Mittagsangebot bis hin zu einer feinen Kaffee- und Kuchenauswahl am Nachmittag.
 </p>
 <p class="bodytext">
  An sonnigen Tagen ein echter Geheimtipp: die große Seeterrasse direkt am Wasser mit traumhaftem Blick auf den Bodensee. Die Seeterrassen sind ein herrlicher Ort, um die sommerlichen Sonnenstrahlen zu genießen.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns in den Rothaus Seeterrassen gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473132X101664320X77675" rel="noopener" target="_blank" title="Umfrage Rothaus Seeterrassen 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
 <p class="bodytext">
  <br/>
  <strong>
   Übrigens:
  </strong>
  <br/>
  <em>
   Sie lieben BBQ und lauschige Sommerabende mit Familie und Freunden? Dann buchen Sie die Rothaus-Seeterrassen in den Abendstunden für Ihre Feier bis max. 60 Personen und genießen Sie gemeinsam die stimmungsvolle Atmosphäre der Insel Mainau bei Sonnenuntergang. Reservierungen nimmt gerne unser Bankettbüro unter +49 (0) 7531 303-156 entgegen.
  </em>
 </p>
</div>
'),('Café &quot;Vergissmeinnicht&quot;',47.70541029577561, 9.193795471661895,'gastro_vergissmeinnicht-1_1080x720.jpg','
ÖffnungszeitenMontag bis Freitag von 10.00 bis 16.00 Uhr, Sonntag von 11.00 bis 16.00 UhrSamstag Ruhetag
Das Café "Vergissmeinnicht" wird von Jugendlichen mit besonderem Förderbedarf betrieben, die Teil des Fachbereiches "Pro Integration" des gemeinnützigen Vereins "Gärtnern für Alle e.V." sind. Die 11-monatigen berufsvorbereitende Bildungsmaßnahme fördert die sozialen und praktischen Kompetenzen der Teilnehmerinnen und Teilnehmer. Sie werden aktiv in allen Bereichen eingebunden: von der Produktion bis hin zum Verkauf. Ziel ist es, am Ende der Bildungsmaßnahme einen Ausbildungsplatz für die Jugendlichen zu finden.
Angeboten werden vor allem selbsterzeugte Produkte, die im eigenen Garten angepflanzt werden: Tee, Kräuter und Holunder - besonders lecker: unser Mainau-Apfelsaft!Genießen Sie in der idyllischen Gartenlounge Frischkäsebrote mit Kräutern, Kaffeespezialitäten, Bodenseewasser und Erfrischungsgetränke. Entspannen Sie in den gemütlichen Sitzgruppen und lassen Sie Ihren Blick über den "Garten für Alle" schweifen. Das Besondere an diesem grünen Blickfang sind die verschiedenen Hochbeete, die rollstuhlgerecht angelegt und in Blindenschrift beschildert sind.
Das Projekt Café "Vergissmeinnicht" wurde von Sandra Gräfin Bernadotte initiiert.
 ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten
   </strong>
   <br/>
   Montag bis Freitag von 10.00 bis 16.00 Uhr, Sonntag von 11.00 bis 16.00 Uhr
   <br/>
   Samstag Ruhetag
   <br/>
   <br/>
  </span>
 </p>
 <p>
  Das Café "Vergissmeinnicht" wird von Jugendlichen mit besonderem Förderbedarf betrieben, die Teil des Fachbereiches "Pro Integration" des gemeinnützigen Vereins "Gärtnern für Alle e.V." sind. Die 11-monatigen berufsvorbereitende Bildungsmaßnahme fördert die sozialen und praktischen Kompetenzen der Teilnehmerinnen und Teilnehmer. Sie werden aktiv in allen Bereichen eingebunden: von der Produktion bis hin zum Verkauf. Ziel ist es, am Ende der Bildungsmaßnahme einen Ausbildungsplatz für die Jugendlichen zu finden.
 </p>
 <p>
  Angeboten werden vor allem selbsterzeugte Produkte, die im eigenen Garten angepflanzt werden: Tee, Kräuter und Holunder - besonders lecker: unser Mainau-Apfelsaft!
  <br/>
  <br/>
  Genießen Sie in der idyllischen Gartenlounge Frischkäsebrote mit Kräutern, Kaffeespezialitäten, Bodenseewasser und Erfrischungsgetränke. Entspannen Sie in den gemütlichen Sitzgruppen und lassen Sie Ihren Blick über den "Garten für Alle" schweifen. Das Besondere an diesem grünen Blickfang sind die verschiedenen Hochbeete, die rollstuhlgerecht angelegt und in Blindenschrift beschildert sind.
 </p>
 <p>
  Das Projekt Café "Vergissmeinnicht" wurde von Sandra Gräfin Bernadotte initiiert.
 </p>
 <p class="bodytext">
  <br/>
  <br/>
 </p>
</div>
'),('Mainau-Träff',47.70130562581442, 9.184874996647313,'traeff_1080x720.jpg','
Öffnungszeiten1. April bis 1. Oktober: 10.00 bis 17.00 UhrMontag & Dienstag Ruhetag
Direkt am Eingang, noch auf dem Festland, finden Sie eine Attraktion zum Einkehren und Einkaufen. Das Bistro und der Kiosk befinden sich am neu gestalteten Inseleingang. Zur Stärkung bieten wir Ihnen kleine leckere Gerichte und Erfrischungsgetränke. Lecker belegte Brötchen und Kaffee und Kuchen laden zu einer kurzen Stärkung vor der Weiterreise ein.
Der Souvenirshop bietet besonders attraktiven Reiseproviant:die Mainau Edition ausgesuchter regionaler Produkte. Zum Beispiel selbstgebrannten Mainau Schnaps und Liköre, Mainau Obst, Marmeladen, Honig, Wurst, Käse u.v.m.
Auch Spaziergänger, Wanderer und Fahrradfahrer außerhalb der Insel finden hier eine reizvolle Möglichkeit, sich während einer kleinen Rast zu stärken.
Wie hat es Ihnen bei uns im Mainau Träff gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen ','<div class="col-xs-12 col-md-6">
 <p class="bodytext" style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten
   </strong>
   <br/>
   1. April bis 1. Oktober: 10.00 bis 17.00 Uhr
   <br/>
   Montag &amp; Dienstag Ruhetag
  </span>
 </p>
 <p class="bodytext">
  Direkt am Eingang, noch auf dem Festland, finden Sie eine Attraktion zum Einkehren und Einkaufen. Das Bistro und der Kiosk befinden sich am neu gestalteten Inseleingang. Zur Stärkung bieten wir Ihnen kleine leckere Gerichte und Erfrischungsgetränke. Lecker belegte Brötchen und Kaffee und Kuchen laden zu einer kurzen Stärkung vor der Weiterreise ein.
 </p>
 <p class="bodytext">
  Der Souvenirshop bietet besonders attraktiven Reiseproviant:
  <br/>
  die Mainau Edition ausgesuchter regionaler Produkte.
  <br/>
  Zum Beispiel selbstgebrannten Mainau Schnaps und Liköre, Mainau Obst, Marmeladen, Honig, Wurst, Käse u.v.m.
 </p>
 <p class="bodytext">
  Auch Spaziergänger, Wanderer und Fahrradfahrer außerhalb der Insel finden hier eine reizvolle Möglichkeit, sich während einer kleinen Rast zu stärken.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Mainau Träff gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473137X101664400X61066" rel="noopener" target="_blank" title="Umfrage Mainau Träff 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
</div>
'),('Würstle-Grill',47.70581099821776, 9.198962673959375,'grill_1080x720-1.jpg','
Öffnungszeiten24. März bis 31. März: 12.00 bis 16.00 Uhr1. April bis 1. Oktober: 11.00 bis 17.00 Uhr2. bis 22. Oktober: 12.00 bis 16.00 Uhr
Grillwurst unter Blüten - In bester Lage an der freigelegten, historischen Schlossmauer unter Kastanien genießen Mainau-Gäste an bepflanzten Tischen frisch gegrillte Würste.
Dementsprechend vielfältig ist das Angebot: von der roten Grillwurst über die Mainauer Rostbratwurst, der Chilibratwurst bis hin zur Kalbsbratwurst. Frische Salate und eine ausgewogene Familienplatte ergänzen unser Angebot. Den Durst löschen alkoholfreie Getränke, Säfte, Biere und Weine aus der Region. Als Ausklang locken  leckere hausgemachte Kuchen nach Omas Rezept.
Den Höhepunkt der Anlage bilden die drei Meter langen, bepflanzten Tische, genannt Tavola Verde. Sogar kleine Bäume wachsen durch die Tischplatten.
Für Abendgesellschaften wie z.B. Geburtstage oder Firmenfeiern bietet die überdachte Terrasse und die bepflanzten Tische einen außergewöhnlichen Rahmen für ein Barbecue. Reservierung nur abends möglich.Abends nur mit Vorreservierung und für geschlossene Gesellschaften.
Wie hat es Ihnen bei uns im Würstle Grill gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen
Informationen & ReservierungenTelefon +49 / (0) 7531 / 303-156Telefax +49 / (0) 7531 / 303-167bankett(at)mainau.de ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten
   </strong>
   <br/>
   24. März bis 31. März: 12.00 bis 16.00 Uhr
   <br/>
   1. April bis 1. Oktober: 11.00 bis 17.00 Uhr
   <br/>
   2. bis 22. Oktober: 12.00 bis 16.00 Uhr
   <br/>
   <br/>
  </span>
 </p>
 <p class="bodytext">
  Grillwurst unter Blüten - In bester Lage an der freigelegten, historischen Schlossmauer unter Kastanien genießen Mainau-Gäste an bepflanzten Tischen frisch gegrillte Würste.
 </p>
 <p class="bodytext">
  Dementsprechend vielfältig ist das Angebot: von der roten Grillwurst über die Mainauer Rostbratwurst, der Chilibratwurst bis hin zur Kalbsbratwurst. Frische Salate und eine ausgewogene Familienplatte ergänzen unser Angebot. Den Durst löschen alkoholfreie Getränke, Säfte, Biere und Weine aus der Region. Als Ausklang locken  leckere hausgemachte Kuchen nach Omas Rezept.
 </p>
 <p class="bodytext">
  Den Höhepunkt der Anlage bilden die drei Meter langen, bepflanzten Tische, genannt Tavola Verde. Sogar kleine Bäume wachsen durch die Tischplatten.
 </p>
 <p class="bodytext">
  Für Abendgesellschaften wie z.B. Geburtstage oder Firmenfeiern bietet die überdachte Terrasse und die bepflanzten Tische einen außergewöhnlichen Rahmen für ein Barbecue. Reservierung nur abends möglich.
  <br/>
  <br/>
  Abends nur mit Vorreservierung und für geschlossene Gesellschaften.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Würstle Grill gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473127X101664154X17245" rel="noopener" target="_blank" title="Umfrage Würstle Grill 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
 <p class="bodytext">
  <strong>
   Informationen &amp; Reservierungen
  </strong>
  <br/>
  Telefon +49 / (0) 7531 / 303-156
  <br/>
  Telefax +49 / (0) 7531 / 303-167
  <br/>
  <a>
   bankett(at)mainau.de
  </a>
 </p>
</div>
'),('Biergarten am Hafen',47.70537058635683, 9.200882538370104,'gastro_biergarten_1080x720.jpg','
Öffnungszeiten1. April bis 1. Oktober: 11.00 bis 17.00 UhrMontag & Dienstag Ruhetag
Charmant war sie schon immer, die alte Hafenanlage der Insel Mainau. Im maritimen Ambiente mit direktem Blick auf die Alpen und den See spenden elf Schlafbäume (Seidenbäume) Schatten und laden ein an der frischen Luft zu verweilen.
Der Biergarten am Hafen ist ein Ort, an dem man richtig entspannen und den Alltag vergessen kann. Umfangreiche Köstlichkeiten an unserer Selbstbedienungstheke runden den Aufenthalt im Biergarten ab.
Wie hat es Ihnen bei uns im Biergarten am Hafen gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Öffnungszeiten
   </strong>
   <br/>
   1. April bis 1. Oktober: 11.00 bis 17.00 Uhr
   <br/>
   Montag &amp; Dienstag Ruhetag
  </span>
 </p>
 <p style="text-align: left;">
  Charmant war sie schon immer, die alte Hafenanlage der Insel Mainau. Im maritimen Ambiente mit direktem Blick auf die Alpen und den See spenden elf Schlafbäume (Seidenbäume) Schatten und laden ein an der frischen Luft zu verweilen.
 </p>
 <p>
  Der Biergarten am Hafen ist ein Ort, an dem man richtig entspannen und den Alltag vergessen kann. Umfangreiche Köstlichkeiten an unserer Selbstbedienungstheke runden den Aufenthalt im Biergarten ab.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Biergarten am Hafen gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473136X101664389X31442" rel="noopener" target="_blank" title="Umfrage Biergarten am Hafen 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
</div>
'),('Restaurant Comturey',47.704991540382295, 9.200710719230587,'osterbrunch-2018.jpg','
Information vom 04. Oktober 2021Das Restaurant Comturey ist geschlossen.
Einen traumhaften Ausblick auf den Bodensee genießen Sie in unsererem Restaurant Comturey. Die Comturey ist Teil unseres Hafenareals, das die vielfältigen Baustile der Mainau vereinigt: der Comturey-Turm aus dem 13. Jahrhundert, der Blick auf das Barockschloss aus dem 18. Jahrhundert, das Hafenhaus aus dem 19. Jahrhundert und das Palmenhaus aus dem Jahr 1998.
Biologisch, regional, saisonal, authentisch - das ist die Philosophie des Comturey-Konzepts:
Genießen Sie erfrischendes Bodenseewasser, aromatisiert mit Minzblättern oder Apfelscheiben oder einen regionalen Bodenseewein. Seien Sie dabei, wenn unsere Köche in der offenen Küche ihre kreativen Speisen aus frischen Zutaten der Region zubereiten.
Freuen Sie sich u.a. auf:

Bodenseefisch-Suppe
Wildkräutersalat
Kalbsragout
Schokoladen-Dessert

Die Terrasse direkt vor der Comturey lädt dazu ein, gemütlich den Sonnenuntergang zu genießen und den Tag mit Blick auf den See ausklingen zu lassen.
Wie hat es Ihnen bei uns im Restaurant Comturey gefallen? Wir freuen uns auf Ihre Rückmeldung:Jetzt an der Umfrage teilnehmen ','<div class="col-xs-12 col-md-6">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Information vom 04. Oktober 2021
   </strong>
   <br/>
   Das Restaurant Comturey ist geschlossen.
  </span>
 </p>
 <p>
  Einen traumhaften Ausblick auf den Bodensee genießen Sie in unsererem Restaurant Comturey. Die Comturey ist Teil unseres Hafenareals, das die vielfältigen Baustile der Mainau vereinigt: der Comturey-Turm aus dem 13. Jahrhundert, der Blick auf das Barockschloss aus dem 18. Jahrhundert, das Hafenhaus aus dem 19. Jahrhundert und das Palmenhaus aus dem Jahr 1998.
 </p>
 <p>
  Biologisch, regional, saisonal, authentisch - das ist die Philosophie des Comturey-Konzepts:
 </p>
 <p>
  Genießen Sie erfrischendes Bodenseewasser, aromatisiert mit Minzblättern oder Apfelscheiben oder einen regionalen Bodenseewein. Seien Sie dabei, wenn unsere Köche in der offenen Küche ihre kreativen Speisen aus frischen Zutaten der Region zubereiten.
 </p>
 <p>
  Freuen Sie sich u.a. auf:
 </p>
 <ul>
  <li>
   Bodenseefisch-Suppe
  </li>
  <li>
   Wildkräutersalat
  </li>
  <li>
   Kalbsragout
  </li>
  <li>
   Schokoladen-Dessert
  </li>
 </ul>
 <p>
  Die Terrasse direkt vor der Comturey lädt dazu ein, gemütlich den Sonnenuntergang zu genießen und den Tag mit Blick auf den See ausklingen zu lassen.
 </p>
 <p>
  <strong>
   Wie hat es Ihnen bei uns im Restaurant Comturey gefallen? Wir freuen uns auf Ihre Rückmeldung:
   <br/>
   <br/>
  </strong>
  <a class="btn btn-default" href="https://ntgt.de/a/s.aspx?s=473138X101664406X19019" rel="noopener" target="_blank" title="Umfrage Comturey 2022">
   Jetzt an der Umfrage teilnehmen
  </a>
 </p>
</div>
');



INSERT INTO events (title, start_date, end_date, location, picture, price, price_child, price_senior, price_student, description, description_html)
VALUES 

('Ausstellung: Frühlingsträume (03.03.2023–14.05.2023)','2023-03-03','2023-08-14','Barockschloss','ausstellung-fruehlingstraeume-2020.jpg',6.00,NULL,3.00,NULL,'
Die Natur erwacht: Strahlendes Sonnengelb, frisches Frühlingsgrün, intensives Leuchtendrot und reines Blütenweiß verscheuchen das triste Wintergrau und bringen die Wiesen und Beete auf der Insel Mainau leuchten. Auch in den Ausstellungsräumen von Schloss Mainau erwecken wir bunte "Frühlingsträume" zum Leben. Freuen Sie sich auf farbenfrohe Blumenarrangements sowie frühlingshafte Dekorationen, die zum Inspirieren für Zuhause und zum Verweilen einladen.
U.a. werden auch die Bilder der Konstanzer Kunsttherapeutin Haide Riedle ausgestellt, die sich optimal abgestimmt an den Charme der Ausstellung anpassen. Außerdem werden Upcycling-Möbel der CreAktiv-Werkstatt des Caritas FAIRKAUFs, die von langzeitarbeitslosen Menschen liebevoll zu Unikaten umgestaltet werden, zum Verkauf angeboten.
Die Ausstellung ist vom 3. März bis 14. Mai 2023 jeweils von 10.00 bis 17.00 Uhr geöffnet.
Stand: Februar 2023, Änderungen vorbehalten
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p class="bodytext">
  Die Natur erwacht: Strahlendes Sonnengelb, frisches Frühlingsgrün, intensives Leuchtendrot und reines Blütenweiß verscheuchen das triste Wintergrau und bringen die Wiesen und Beete auf der Insel Mainau leuchten. Auch in den Ausstellungsräumen von Schloss Mainau erwecken wir bunte "Frühlingsträume" zum Leben. Freuen Sie sich auf farbenfrohe Blumenarrangements sowie frühlingshafte Dekorationen, die zum Inspirieren für Zuhause und zum Verweilen einladen.
 </p>
 <p class="bodytext">
  U.a. werden auch die Bilder der Konstanzer Kunsttherapeutin Haide Riedle ausgestellt, die sich optimal abgestimmt an den Charme der Ausstellung anpassen. Außerdem werden Upcycling-Möbel der CreAktiv-Werkstatt des Caritas FAIRKAUFs, die von langzeitarbeitslosen Menschen liebevoll zu Unikaten umgestaltet werden, zum Verkauf angeboten.
 </p>
 <p class="bodytext">
  Die Ausstellung ist vom 3. März bis 14. Mai 2023 jeweils von 10.00 bis 17.00 Uhr geöffnet.
 </p>
 <p class="bodytext">
  <em>
   Stand: Februar 2023, Änderungen vorbehalten
  </em>
 </p>
</div>
'),('Blumenjahr 2023: Schlossjuwel &amp; Gartenrausch (17.03.2023–22.10.2023)','2023-03-17','2023-10-22','Italienischer Rosengarten','jahresmotto2016_1080x720.jpg',5.00,NULL,2.50,2.50,'
Lebendige Inselgeschichte kunstvoll in Szene gesetztDas Jahresmotto 2023 „Schlossjuwel & Gartenrausch – Grüne Fürsten am Bodensee“ vereint lebendige Inselgeschichte mit schwärmerischer Gartenlust. Dieses Mal wird das Wirken des österreichischen Fürsten Nikolaus II. Esterházy auf der Insel Mainau im Mittelpunkt stehen. Er gestaltete nicht nur die Insel nach der Deutschordenszeit um, sondern prägte zusammen mit Prinz Louis Napoléon, dem späteren französischen Kaiser, die Region des westlichen Bodensees.
Orchideenschau 2023Entdecker des 18. und 19. Jahrhunderts brachten die exotischen Pflanzenschönheiten erstmals auf dem Seeweg nach Europa. Diese Zeit der Abenteurer und Pflanzenjäger thematisiert die diesjährige Orchideenschau, die ab 17. März im Palmenhaus zu sehen ist. 
Fotopoint: Barocke BlumenkleiderZwei bunt bepflanzte barocke Kleider stehen unweit von der Schlosskirche und warten nur darauf, von Ihnen „getragen“ zu werden. Also, rein ins Kleid, Foto machen und in den sozialen Medien teilen!
Ausstellung "Il Magnifico auf der Insel Mainau"Digitale und analoge Installationen geben vom 26. Mai bis 24. September 2023 einen genussvollen Einblick in den höfischen "Lifestyle" des Grünen Fürsten Nikolaus II. Esterházy.
Stand: März 2023, weitere Informationen folgen
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  <strong>
   Lebendige Inselgeschichte kunstvoll in Szene gesetzt
  </strong>
  <br/>
  Das Jahresmotto 2023 „Schlossjuwel &amp; Gartenrausch – Grüne Fürsten am Bodensee“ vereint lebendige Inselgeschichte mit schwärmerischer Gartenlust. Dieses Mal wird das Wirken des österreichischen Fürsten Nikolaus II. Esterházy auf der Insel Mainau im Mittelpunkt stehen. Er gestaltete nicht nur die Insel nach der Deutschordenszeit um, sondern prägte zusammen mit Prinz Louis Napoléon, dem späteren französischen Kaiser, die Region des westlichen Bodensees.
 </p>
 <p>
  <strong>
   Orchideenschau 2023
  </strong>
  <br/>
  Entdecker des 18. und 19. Jahrhunderts brachten die exotischen Pflanzenschönheiten erstmals auf dem Seeweg nach Europa. Diese Zeit der Abenteurer und Pflanzenjäger thematisiert die diesjährige
  <a href="de/event-detail/orchideenschau-2023.html" title="Orchideenschau 2023">
   Orchideenschau
  </a>
  , die ab 17. März im Palmenhaus zu sehen ist.
 </p>
 <p>
  <strong>
   Fotopoint: Barocke Blumenkleider
  </strong>
  <br/>
  Zwei bunt bepflanzte barocke Kleider stehen unweit von der Schlosskirche und warten nur darauf, von Ihnen „getragen“ zu werden. Also, rein ins Kleid, Foto machen und in den sozialen Medien teilen!
 </p>
 <p>
  <strong>
   Ausstellung "Il Magnifico auf der Insel Mainau"
  </strong>
  <br/>
  Digitale und analoge Installationen geben vom 26. Mai bis 24. September 2023 einen genussvollen Einblick in den höfischen "Lifestyle" des Grünen Fürsten Nikolaus II. Esterházy.
 </p>
 <p>
  <em>
   Stand: März 2023, weitere Informationen folgen
  </em>
 </p>
</div>
'),('Brunch: Ostermontag (Montag, 10.04.2023, 10:30–14:30)','2023-10-10','2023-10-10','Restaurant Comturey','osterbrunch_1080x720.jpg',5.00,1.00,1.50,NULL,'
Information vom 15. März 2023Der Brunch ist online ausgebucht. Restplätze gibt es nur noch bei direkter Reservierung über das Mainau-Bankettbüro.
Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Ostermontag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
Stand: Februar 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Information vom 15. März 2023
   </strong>
   <br/>
   Der Brunch ist online ausgebucht. Restplätze gibt es nur noch bei direkter Reservierung über das Mainau-Bankettbüro.
  </span>
 </p>
 <p>
  Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Ostermontag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.
  <br/>
  <br/>
  Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
 </p>
 <p>
  In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: Februar 2023
  </em>
 </p>
</div>
'),('Brunch: Ostersonntag (Sonntag, 09.04.2023, 10:30–14:30)','2023-04-09','2023-04-09','Restaurant Comturey','osterbrunch_1080x720.jpg',5.00,0.50,1.50,NULL,'
Information vom 14. März 2023Der Brunch ist online ausgebucht. Restplätze gibt es nur noch bei direkter Reservierung über das Mainau-Bankettbüro.
Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Ostersonntag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
Stand: März 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Information vom 14. März 2023
   </strong>
   <br/>
   Der Brunch ist online ausgebucht. Restplätze gibt es nur noch bei direkter Reservierung über das Mainau-Bankettbüro.
  </span>
 </p>
 <p>
  Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Ostersonntag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.
  <br/>
  <br/>
  Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
 </p>
 <p>
  In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: März 2023
  </em>
 </p>
</div>
'),('Mainau-Musical-Nights: Die große Schlagernacht (Samstag, 05.08.2023, 19:30)','2023-08-05','2023-08-05','Mediterran-Terrassen','schlagernacht-2023.jpg',50.00,NULL,25.00,25.00,'
„Er gehört zu mir“, „Ein Bett im Kornfeld“ oder „Verlieben, verloren, vergessen, verzeih’n“ – Schlager ist der Gute Laune-Booster schlechthin und steht für pure Lebensfreude und Spaß. Aus diesem Grund ist die „Große Schlagernacht“ auch im Sommer 2023 wieder fester Programmpunkt der Mainau Musical Nights. Ein Konzert, das Jung und Alt begeistert! Passend zum Konzept von musicalpeople werden auch hier Musical-Songs, zum Beispiel aus den Gute-Laune-Musicals „Wahnsinn!“ von Wolfgang Petry und „Ich Will Spaß!“ zu hören sein, sowie Hits von diversen Schlagerlegenden, wie immer begleitet von der fantastischen musicalpeople-Liveband. Für italienisches Flair sorgt außerdem ein Block mit den besten Italo-Hits. Ein Abend voll Leichtigkeit, der alle Sorgen vergessen lässt – und das in einzigartiger Atmosphäre, live und Open Air – lassen Sie sich dieses Konzert-Highlight nicht entgehen!
Es singen Jessica Kessler, Roberta Valentini, Maximilian Mann und Karim Khawatmi.
Über die musicalpeople:musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.Weitere Informationen zur Veranstaltung:Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen hier buchbar.
Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
Stand: März 2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  „Er gehört zu mir“, „Ein Bett im Kornfeld“ oder „Verlieben, verloren, vergessen, verzeih’n“ – Schlager ist der Gute Laune-Booster schlechthin und steht für pure Lebensfreude und Spaß. Aus diesem Grund ist die „Große Schlagernacht“ auch im Sommer 2023 wieder fester Programmpunkt der Mainau Musical Nights. Ein Konzert, das Jung und Alt begeistert! Passend zum Konzept von musicalpeople werden auch hier Musical-Songs, zum Beispiel aus den Gute-Laune-Musicals „Wahnsinn!“ von Wolfgang Petry und „Ich Will Spaß!“ zu hören sein, sowie Hits von diversen Schlagerlegenden, wie immer begleitet von der fantastischen musicalpeople-Liveband. Für italienisches Flair sorgt außerdem ein Block mit den besten Italo-Hits. Ein Abend voll Leichtigkeit, der alle Sorgen vergessen lässt – und das in einzigartiger Atmosphäre, live und Open Air – lassen Sie sich dieses Konzert-Highlight nicht entgehen!
 </p>
 <p>
  Es singen Jessica Kessler, Roberta Valentini, Maximilian Mann und Karim Khawatmi.
 </p>
 <p>
  <strong>
   Über die musicalpeople:
   <br/>
  </strong>
  musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.
  <br/>
  <br/>
  <strong>
   Weitere Informationen zur Veranstaltung:
  </strong>
  <br/>
  Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
 </p>
 <p>
  Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen
  <a href="https://bit.ly/3yPN8UI" rel="noopener" target="_blank" title="Schifffahrt Mainau Musical Nights">
   hier
  </a>
  buchbar.
 </p>
 <p>
  Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Frontm3n (Sonntag, 20.08.2023, 19:30)','2023-08-20','2023-08-20','Dachgarten','frontman.jpg',49.99,9.99,24.99,24.99,'
FRONTM3N! Bekannt wurden die drei fabelhaften Sänger unter anderem als Sänger der Hollies, 10cc, Sweet, Sailor oder Smokie.
Frontm3n, die wegen ihres fantastischen Harmoniegesangs und ihrer Ohrwurm-Melodien längst als die „britischen Eagles“ gelten, veröffentlichten bereits Ende Oktober 2021 ihr neues Studioalbum „Enjoy The Ride“, das mit zwölf brandneuen, selbstgeschriebenen Songs ein kleines Meisterwerk geworden ist.
Nun folgt die Tour zum Album. Wie gewohnt „An Exclusive Acoustic Night“, vollgepackt mit Hits und eigenen Songs, die jeder kennt und jeder liebt, neu und auf frische, akustische Art interpretiert. Jeder Song mit seiner eigenen Geschichte aus der musikalischen Reise der drei Musiker.
Das Brit-Trio ist durchaus eine Art Supergroup - immerhin ist oder war jeder von ihnen Sänger einer Band, die es bis in die höchsten Pop- und Rocksphären schaffte. Howarth ist seit Jahren Sänger von The Hollies, Lincoln war 13 Jahre Leadsänger bei Sweet und ist aktuell der Frontmann bei Smokie und Wilson lieh seine Stimme 20 Jahre lang der Band 10cc. Gemeinsam agiert das Trio inzwischen seit 7 Jahren Jahren als FRONTM3N!
Erleben Sie die drei Ausnahmemusiker auf Ihrer „Enjoy The Ride“ – Tour 2023 und genießen Sie ein „Unplugged“ – Konzert der Extraklasse. 
Informationen zur Veranstaltung:

Für Konzertbesucher gilt 60 Minuten vor Einlass in das Konzertgelände freier Eintritt auf die Insel Mainau.
Kostenfreie Nutzung des Inselbusses vor und nach dem Konzert.
Das Mitbringen von Tieren auf das Konzertgelände ist nicht erlaubt.
Es gelten die Veranstaltungsbedingungen des Veranstalters.
Das Hausrecht obliegt der Mainau GmbH.
Die Tickets können nicht zurückgenommen werden.

Stand: März 2023, Änderungen vorbehalten
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  FRONTM3N! Bekannt wurden die drei fabelhaften Sänger unter anderem als Sänger der Hollies, 10cc, Sweet, Sailor oder Smokie.
 </p>
 <p>
  Frontm3n, die wegen ihres fantastischen Harmoniegesangs und ihrer Ohrwurm-Melodien längst als die „britischen Eagles“ gelten, veröffentlichten bereits Ende Oktober 2021 ihr neues Studioalbum „Enjoy The Ride“, das mit zwölf brandneuen, selbstgeschriebenen Songs ein kleines Meisterwerk geworden ist.
 </p>
 <p>
  Nun folgt die Tour zum Album. Wie gewohnt „An Exclusive Acoustic Night“, vollgepackt mit Hits und eigenen Songs, die jeder kennt und jeder liebt, neu und auf frische, akustische Art interpretiert. Jeder Song mit seiner eigenen Geschichte aus der musikalischen Reise der drei Musiker.
 </p>
 <p>
  Das Brit-Trio ist durchaus eine Art Supergroup - immerhin ist oder war jeder von ihnen Sänger einer Band, die es bis in die höchsten Pop- und Rocksphären schaffte. Howarth ist seit Jahren Sänger von The Hollies, Lincoln war 13 Jahre Leadsänger bei Sweet und ist aktuell der Frontmann bei Smokie und Wilson lieh seine Stimme 20 Jahre lang der Band 10cc. Gemeinsam agiert das Trio inzwischen seit 7 Jahren Jahren als FRONTM3N!
 </p>
 <p>
  Erleben Sie die drei Ausnahmemusiker auf Ihrer „Enjoy The Ride“ – Tour 2023 und genießen Sie ein „Unplugged“ – Konzert der Extraklasse.
 </p>
 <p>
  <strong>
   Informationen zur Veranstaltung:
  </strong>
 </p>
 <ul>
  <li class="c-event-hygiene-info__text">
   Für Konzertbesucher gilt 60 Minuten vor Einlass in das Konzertgelände freier Eintritt auf die Insel Mainau.
  </li>
  <li class="c-event-hygiene-info__text">
   Kostenfreie Nutzung des Inselbusses vor und nach dem Konzert.
  </li>
  <li class="c-event-hygiene-info__text">
   Das Mitbringen von Tieren auf das Konzertgelände ist nicht erlaubt.
  </li>
  <li class="c-event-hygiene-info__text">
   Es gelten die Veranstaltungsbedingungen des Veranstalters.
  </li>
  <li class="c-event-hygiene-info__text">
   Das Hausrecht obliegt der Mainau GmbH.
  </li>
  <li class="c-event-hygiene-info__text">
   Die Tickets können nicht zurückgenommen werden.
  </li>
 </ul>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten
  </em>
 </p>
</div>
'),('German Brass (Freitag, 14.07.2023, 19:30)','2023-07-14','2023-07-14','Dachgarten','germanbrass.jpg',49.99,NULL,15.99,25.99,'
Aktuelle Information vom VeranstalterLeider musste die Veranstaltung von GERMAN BRASS vom 13.08.2022 auf den 14.07.2023 verlegt werden - Karten behalten ihre Gültigkeit. 
Wer kann von sich behaupten aus Blech Gold machen zu können? Die Blechbläserformation von German Brass meistert herausfordernde Musikstücke der Oper und verleiht ihnen einen eigenen, kräftig modernen Glanz. Mit ihren Konzerten füllen sie weltweit große Säle und werden am 13. August mit ihrem Programm „Live in Concert“ auch auf die Open Air Bühne der Insel Mainau für ein einzigartiges Musikerlebnis sorgen. Die Faszination Brass Band verhilft den großen Werken zum Strahlen und überträgt die Themen der Oper in die Gegenwart.  
Die Musik von German Brass lebt von spannenden Gegensätzen ebenso wie die Kulisse, welche sie bespielen. Das Sonnendach im Schlossgarten transportiert die bespielten Inhalte, während die moderne Bühne und der offen lebendige Rahmen die Klangdimensionen gänzlich entfalten lassen. Die Klangfarbe mag durch die Blechbläser rau erscheinen, erklingt jedoch weich und dafür nicht weniger voluminös. Das Ambiente getaucht in die Farben des blühenden Sommers bietet eine Szenerie für die lebendige Musik von German Brass, welche die Werte eines geselligen Lebens transportiert. Gibt es eine Kulisse mit geeigneteren Synergien? An diesem Abend werden nicht nur den Zuhörer:innen ungeahnte Klangdimensionen eröffnet, der gesamte Schlossgarten wird mit Leben gefüllt.
Im ersten Teil des Konzertes entfalten die zehn Musiker von German Brass ihre sinfonische Pracht und Dynamik mit klassischen Melodien von Johann Sebastian Bach, Georg Friedrich Händel oder Guiseppe Verdi. Im zweiten Teil begeben sie sich gemeinsam mit dem Publikum auf eine musikalische Reise um die Welt. Diese scheinbare Unendlichkeit der Genres weckt musikalische Neugier und macht German Brass zum erfolgreichsten Blechbläserensemble Europas. Mit jedem ihrer Auftritte lassen sie die Herzen ihres Publikums höherschlagen. 2016 wurde das Ensemble mit einem Echo Klassik in der Kategorie Ensemble/Orchester ausgezeichnet.
Informationen zur Veranstaltung:

Für Konzertbesucher gilt 60 Minuten vor Einlass in das Konzertgelände freier Eintritt auf die Insel Mainau.
Kostenfreie Nutzung des Inselbusses vor und nach dem Konzert.
Das Mitbringen von Tieren auf das Konzertgelände ist nicht erlaubt.
Es gelten die Veranstaltungsbedingungen des Veranstalters.
Das Hausrecht obliegt der Mainau GmbH.
Die Tickets können nicht zurückgenommen werden.

Stand: März 2023, Änderungen vorbehalten; Copyright Bildmaterial: Gregor-Hohenberg
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Aktuelle Information vom Veranstalter
   </strong>
   <br/>
   Leider musste die Veranstaltung von GERMAN BRASS vom 13.08.2022 auf den 14.07.2023 verlegt werden - Karten behalten ihre Gültigkeit.
  </span>
 </p>
 <p>
  Wer kann von sich behaupten aus Blech Gold machen zu können? Die Blechbläserformation von German Brass meistert herausfordernde Musikstücke der Oper und verleiht ihnen einen eigenen, kräftig modernen Glanz. Mit ihren Konzerten füllen sie weltweit große Säle und werden am 13. August mit ihrem Programm „Live in Concert“ auch auf die Open Air Bühne der Insel Mainau für ein einzigartiges Musikerlebnis sorgen. Die Faszination Brass Band verhilft den großen Werken zum Strahlen und überträgt die Themen der Oper in die Gegenwart.
 </p>
 <p>
  Die Musik von German Brass lebt von spannenden Gegensätzen ebenso wie die Kulisse, welche sie bespielen. Das Sonnendach im Schlossgarten transportiert die bespielten Inhalte, während die moderne Bühne und der offen lebendige Rahmen die Klangdimensionen gänzlich entfalten lassen. Die Klangfarbe mag durch die Blechbläser rau erscheinen, erklingt jedoch weich und dafür nicht weniger voluminös. Das Ambiente getaucht in die Farben des blühenden Sommers bietet eine Szenerie für die lebendige Musik von German Brass, welche die Werte eines geselligen Lebens transportiert. Gibt es eine Kulisse mit geeigneteren Synergien? An diesem Abend werden nicht nur den Zuhörer:innen ungeahnte Klangdimensionen eröffnet, der gesamte Schlossgarten wird mit Leben gefüllt.
 </p>
 <p>
  Im ersten Teil des Konzertes entfalten die zehn Musiker von German Brass ihre sinfonische Pracht und Dynamik mit klassischen Melodien von Johann Sebastian Bach, Georg Friedrich Händel oder Guiseppe Verdi. Im zweiten Teil begeben sie sich gemeinsam mit dem Publikum auf eine musikalische Reise um die Welt. Diese scheinbare Unendlichkeit der Genres weckt musikalische Neugier und macht German Brass zum erfolgreichsten Blechbläserensemble Europas. Mit jedem ihrer Auftritte lassen sie die Herzen ihres Publikums höherschlagen. 2016 wurde das Ensemble mit einem Echo Klassik in der Kategorie Ensemble/Orchester ausgezeichnet.
 </p>
 <p>
  <strong>
   Informationen zur Veranstaltung:
  </strong>
 </p>
 <ul>
  <li class="c-event-hygiene-info__text">
   Für Konzertbesucher gilt 60 Minuten vor Einlass in das Konzertgelände freier Eintritt auf die Insel Mainau.
  </li>
  <li class="c-event-hygiene-info__text">
   Kostenfreie Nutzung des Inselbusses vor und nach dem Konzert.
  </li>
  <li class="c-event-hygiene-info__text">
   Das Mitbringen von Tieren auf das Konzertgelände ist nicht erlaubt.
  </li>
  <li class="c-event-hygiene-info__text">
   Es gelten die Veranstaltungsbedingungen des Veranstalters.
  </li>
  <li class="c-event-hygiene-info__text">
   Das Hausrecht obliegt der Mainau GmbH.
  </li>
  <li class="c-event-hygiene-info__text">
   Die Tickets können nicht zurückgenommen werden.
  </li>
 </ul>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten; Copyright Bildmaterial: Gregor-Hohenberg
  </em>
 </p>
</div>
'),('Kinderschatzsuche (17.03.2023–22.10.2023)','2023-03-17','2023-10-22','Mainau Kinderland','kinderschatzsuche.jpg',5.00,0.50,2.50,NULL,'
Knifflige Fragen, spannende Stationen, versteckte Hinweise: Begebt euch mit euren Eltern und Geschwistern, den Großeltern und euren Freunden auf Entdeckungstour. Löst gemeinsam das Rätsel um den Mainau-Schatz und erhaltet am Ende einen Finderlohn.
Schatzsuche 2023In diesem Jahr muss unser Mainau-Maskottchen Blumi das Zaubern erlernen um die verwunschene Schatztruhe wieder öffnen zu können. Dafür muss er sechs Rätsel lösen. Werdet ihr ihm bei der Suche nach der Lösung helfen?
Die Schatzsuche dauert ca. 60 Minuten, eignet sich für Kinder ab 6 Jahren und ist kostenfrei. Vergesst nicht, einen Stift mitzubringen, damit ihr euch die Hinweise notieren könnt. Die Schatzkarte wird am Inseleingang und am Hafen ausgegeben.Weitere Informationenwww.mainau.de/kinderschatzsuche.html
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Knifflige Fragen, spannende Stationen, versteckte Hinweise: Begebt euch mit euren Eltern und Geschwistern, den Großeltern und euren Freunden auf Entdeckungstour. Löst gemeinsam das Rätsel um den Mainau-Schatz und erhaltet am Ende einen Finderlohn.
 </p>
 <p>
  <strong>
   Schatzsuche 2023
  </strong>
  <br/>
  In diesem Jahr muss unser Mainau-Maskottchen Blumi das Zaubern erlernen um die verwunschene Schatztruhe wieder öffnen zu können. Dafür muss er sechs Rätsel lösen. Werdet ihr ihm bei der Suche nach der Lösung helfen?
 </p>
 <p>
  <em>
   Die Schatzsuche dauert ca. 60 Minuten, eignet sich
  </em>
  <em>
   für Kinder ab 6 Jahren und ist kostenfrei. Vergesst nicht, einen Stift mitzubringen, damit ihr euch die Hinweise notieren könnt.
   <span class="fehler">
    Die Schatzkarte wird am Inseleingang und am Hafen ausgegeben.
   </span>
   <br/>
   <br/>
  </em>
  Weitere Informationen
  <br/>
  <a href="kinderschatzsuche.html" title="Kinderschatzsuche | Insel Mainau">
   www.mainau.de/kinderschatzsuche.html
  </a>
 </p>
</div>
'),('Mainau-Musical-Nights: Lets Rock (Freitag, 04.08.2023, 19:30)','2023-08-04','2023-08-04','Sonja und Lennart Bernadotte Platz','letsrock-2023.jpg',104.98,NULL,NULL,78.98,'
Von Songs aus dem Queen-Musical „We Will Rock You“ über Hits aus „Rock Of Ages“ bis hin zu Songs legendärer Rockbands – an diesem Abend werden wir die Stimmung auf der Blumeninsel im Bodensee ein weiteres Mal so richtig zum Kochen bringen. Die Solistinnen und Solisten gehören allesamt zu den Original-Besetzungen der Musicals, und dass sie den Rock im Blut haben, das haben sie mit den erfolgreichen Konzerten der letzten Jahren mehrfach bewiesen. Für den richtigen Rock-Sound sorgen die Vollblut-Musiker der musicalpeople-Liveband. Machen Sie sich bereit für ein Rock-Erlebnis der Extraklasse – live und Open Air.
Es singen Linda Holmgren, Jessica Kessler und John Vooijs.
Über die musicalpeople:musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.Weitere Informationen zur Veranstaltung:Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen hier buchbar.
Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
Stand: März 2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Von Songs aus dem Queen-Musical „We Will Rock You“ über Hits aus „Rock Of Ages“ bis hin zu Songs legendärer Rockbands – an diesem Abend werden wir die Stimmung auf der Blumeninsel im Bodensee ein weiteres Mal so richtig zum Kochen bringen. Die Solistinnen und Solisten gehören allesamt zu den Original-Besetzungen der Musicals, und dass sie den Rock im Blut haben, das haben sie mit den erfolgreichen Konzerten der letzten Jahren mehrfach bewiesen. Für den richtigen Rock-Sound sorgen die Vollblut-Musiker der musicalpeople-Liveband. Machen Sie sich bereit für ein Rock-Erlebnis der Extraklasse – live und Open Air.
 </p>
 <p>
  Es singen Linda Holmgren, Jessica Kessler und John Vooijs.
 </p>
 <p>
  <strong>
   Über die musicalpeople:
   <br/>
  </strong>
  musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.
  <br/>
  <br/>
  <strong>
   Weitere Informationen zur Veranstaltung:
  </strong>
  <br/>
  Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
 </p>
 <p>
  Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen
  <a href="https://bit.ly/3yPN8UI" rel="noopener" target="_blank" title="Schifffahrt Mainau Musical Nights">
   hier
  </a>
  buchbar.
 </p>
 <p>
  Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Mainau-Musical-Nights: Mamma Mia meets Udo Jürgens (Donnerstag, 03.08.2023, 19:30)','2023-08-03','2023-08-03','Ufergarten','mammamia-2023.jpg',150.00,NULL,NULL,NULL,'
„Thank You For The Music!, „Super Trouper“ oder „Griechischer Wein“ – ob Jung oder Alt, nahezu jeder kennt die weltbekannten, mitreißenden Songs von ABBA und Udo Jürgens. Bereits in den vergangenen Jahren sorgte dieses Erfolgs-Programm für Begeisterungsstürme und Standing-Ovations und gehört mittlerweile zum festen Bestandteil der Mainau Musical Nights. Grandiose Stimmung und gute Laune sind an diesem Abend vorprogrammiert.
Es singen Roberta Valentini, Ana Milva Gomes und Karim Khawatmi.
Über die musicalpeople:musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.Weitere Informationen zur Veranstaltung:Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen hier buchbar.
Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
Stand: März 2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  „Thank You For The Music!, „Super Trouper“ oder „Griechischer Wein“ – ob Jung oder Alt, nahezu jeder kennt die weltbekannten, mitreißenden Songs von ABBA und Udo Jürgens. Bereits in den vergangenen Jahren sorgte dieses Erfolgs-Programm für Begeisterungsstürme und Standing-Ovations und gehört mittlerweile zum festen Bestandteil der Mainau Musical Nights. Grandiose Stimmung und gute Laune sind an diesem Abend vorprogrammiert.
 </p>
 <p>
  Es singen Roberta Valentini, Ana Milva Gomes und Karim Khawatmi.
 </p>
 <p>
  <strong>
   Über die musicalpeople:
   <br/>
  </strong>
  musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.
  <br/>
  <br/>
  <strong>
   Weitere Informationen zur Veranstaltung:
  </strong>
  <br/>
  Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
 </p>
 <p>
  Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen
  <a href="https://bit.ly/3yPN8UI" rel="noopener" target="_blank" title="Schifffahrt Mainau Musical Nights">
   hier
  </a>
  buchbar.
 </p>
 <p>
  Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Musicalpeople Symphonic (Mittwoch, 02.08.2023, 19:30)','2023-08-02','2023-08-02','Großherzog-Friedrich-Terrasse','Symphonic.png',80.00,5.00,40.00,NULL,'
Ein Feuerwerk der bekanntesten Musicalsongs, namhafte Musicalstars, begleitet von der einzigartigen musicalpeople-Band und den rund 50 Musikerinnen und Musikern der Südwestdeutschen Philharmonie Konstanz – das verspricht einen unvergesslichen Abend mit Gänsehaut-Momenten und das in einzigartiger Atmosphäre!
Es singen Ana Milva Gomes, Roberta Valentini, John Vooijs und Karim Khawatmi, die musikalische Leitung hat Bernd Steixner.
Über die musicalpeople:musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.Weitere Informationen zur Veranstaltung:Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen hier buchbar.
Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
Stand: März 2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Ein Feuerwerk der bekanntesten Musicalsongs, namhafte Musicalstars, begleitet von der einzigartigen musicalpeople-Band und den rund 50 Musikerinnen und Musikern der Südwestdeutschen Philharmonie Konstanz – das verspricht einen unvergesslichen Abend mit Gänsehaut-Momenten und das in einzigartiger Atmosphäre!
 </p>
 <p>
  Es singen Ana Milva Gomes, Roberta Valentini, John Vooijs und Karim Khawatmi, die musikalische Leitung hat Bernd Steixner.
 </p>
 <p>
  <strong>
   Über die musicalpeople:
   <br/>
  </strong>
  musicalpeople ist eine hochprofessionelle Truppe von Menschen, die durch Ihre Qualität und Vielseitigkeit, ihre musikalische Bandbreite und nicht zuletzt durch ihre Passion zu den Besten ihrer Branche zählen. Sie erleben hier ausschließlich die aktuell führenden Sänger und Musiker der europäischen Musicalbühnen in lebendigen, mitreißenden Show-Programmen.
  <br/>
  <br/>
  <strong>
   Weitere Informationen zur Veranstaltung:
  </strong>
  <br/>
  Konzertgäste erhalten am Veranstaltungstag ab 17.00 Uhr freien Eintritt auf die Insel Mainau. Einlass auf das Konzertgelände ab 17.30 Uhr. Ton- u. Videoaufnahmen sind nicht gestattet. Glasverbot gilt auf dem gesamten Konzertgelände, es gilt die Hausordnung. Karten werden nicht zurückgenommen. Programmänderungen vorbehalten.  Das Mitbringen von Tieren ist nicht erlaubt. Restkarten sind an der Abendkasse erhältlich. Der Aufschlag beträgt 4 € für den Normalpreis.
 </p>
 <p>
  Die Bodenseeschifffahrt bietet einen Schiffstransfer, der Konzertbesucher über den See zu den Veranstaltungen der Mainau Musical Nights und auch danach wieder zurück bringt.  Dieser ist ab Überlingen oder Unteruhldingen
  <a href="https://bit.ly/3yPN8UI" rel="noopener" target="_blank" title="Schifffahrt Mainau Musical Nights">
   hier
  </a>
  buchbar.
 </p>
 <p>
  Die Veranstaltung wird unter Beachtung der dann geltenden Corona-Verordnung in Baden-Württemberg stattfinden. Bitte beachten Sie entsprechende Hinweise und Regelungen vor Ort.
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Muttertagsbrunch (Sonntag, 14.05.2023, 10:30–14:30)','2023-05-14','2023-05-14','Restaurant Comturey','muttertagsbrunch-2021.jpg',5.00,0.50,2.50,NULL,'
Schlemmen Sie am 14. Mai 2023 nach Herzenslust und genießen Sie vielfältige Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig oder vegetarische Speisen. Für jeden ist etwas dabei. Ein geselliges Erlebnis für die ganze Familie & Freunde.
Unser Tipp: Nach einem ausgiebigem Brunch empfehlen wir einen Spaziergang im frühlingshaften Mainau-Park. Die ersten Fliederbüsche und Rhododendren blühen und die Italienische Blumen-Wassertreppe schmückt sich mit spätblühenden Narzissen und Tulpen.
In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
Stand: März 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: left;">
  Schlemmen Sie am 14. Mai 2023 nach Herzenslust und genießen Sie vielfältige Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig oder vegetarische Speisen. Für jeden ist etwas dabei. Ein geselliges Erlebnis für die ganze Familie &amp; Freunde.
 </p>
 <p style="text-align: left;">
  Unser Tipp: Nach einem ausgiebigem Brunch empfehlen wir einen Spaziergang im frühlingshaften Mainau-Park. Die ersten Fliederbüsche und Rhododendren blühen und die Italienische Blumen-Wassertreppe schmückt sich mit spätblühenden Narzissen und Tulpen.
 </p>
 <p>
  In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: März 2023
  </em>
 </p>
</div>
'),('Offene Führung in der Orchideenschau (Donnerstag, 13.04.2023, 11:30–12:30)','2023-04-13','2023-04-13','Palmenhaus','fuehrung-orchideenschau.jpg',12.00,NULL,6.50,10.00,'
Bei einem Rundgang durch unsere Orchideenschau laden wir Sie herzlich ein, Wissenswertes und Informatives über die Welt der Orchideen zu erfahren. Wie sieht der natürliche Lebensraum aus? Woher stammen Orchideen und wie pflegt man Orchideen am besten im heimischen Wohnzimmer?
Unsere Orchideen-Experten erklären Ihnen, wie die traditionelle Orchideenschau auf der Insel Mainau entsteht und beantworten gerne Ihre Fragen über die eleganten Zimmerpflanzen.
Treffpunkt: PalmenhausDauer: ca. 60 MinutenPreis: 10 € pro Person zzgl. InseleintrittMaximale Teilnehmerzahl: 20
Sie haben am 13. April 2023 keine Zeit an der offenen Führung teilzunehmen? Am 25. April 2023 um 15.00 Uhr findet eine weitere Führung statt.
Stand: März 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Bei einem Rundgang durch unsere Orchideenschau laden wir Sie herzlich ein, Wissenswertes und Informatives über die Welt der Orchideen zu erfahren. Wie sieht der natürliche Lebensraum aus? Woher stammen Orchideen und wie pflegt man Orchideen am besten im heimischen Wohnzimmer?
 </p>
 <p>
  Unsere Orchideen-Experten erklären Ihnen, wie die traditionelle Orchideenschau auf der Insel Mainau entsteht und beantworten gerne Ihre Fragen über die eleganten Zimmerpflanzen.
 </p>
 <p>
  Treffpunkt: Palmenhaus
  <br/>
  Dauer: ca. 60 Minuten
  <br/>
  Preis: 10 € pro Person zzgl. Inseleintritt
  <br/>
  Maximale Teilnehmerzahl: 20
 </p>
 <p>
  Sie haben am 13. April 2023 keine Zeit an der offenen Führung teilzunehmen? Am
  <a href="de/event-detail/offene-fuehrung-orchideenschau-25-04-23.html" title="Offene Führung in der Orchideenschau">
   25. April 2023 um 15.00 Uhr
  </a>
  findet eine weitere Führung statt.
 </p>
 <p>
  <em>
   Stand: März 2023
  </em>
 </p>
</div>
'),('Offene Führung in der Orchideenschau (Dienstag, 25.04.2023, 15:00–16:00)','2023-04-25','2023-04-25','Palmenhaus','fuehrung-orchideenschau.jpg',12.00,NULL,6.50,10.00,'
Bei einem Rundgang durch unsere Orchideenschau laden wir Sie herzlich ein, Wissenswertes und Informatives über die Welt der Orchideen zu erfahren. Wie sieht der natürliche Lebensraum aus? Woher stammen Orchideen und wie pflegt man Orchideen am besten im heimischen Wohnzimmer?
Unsere Orchideen-Experten erklären Ihnen, wie die traditionelle Orchideenschau auf der Insel Mainau entsteht und beantworten gerne Ihre Fragen über die eleganten Zimmerpflanzen.
Treffpunkt: PalmenhausDauer: ca. 60 MinutenPreis: 10 € pro Person zzgl. InseleintrittMaximale Teilnehmerzahl: 20
Stand: März 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Bei einem Rundgang durch unsere Orchideenschau laden wir Sie herzlich ein, Wissenswertes und Informatives über die Welt der Orchideen zu erfahren. Wie sieht der natürliche Lebensraum aus? Woher stammen Orchideen und wie pflegt man Orchideen am besten im heimischen Wohnzimmer?
 </p>
 <p>
  Unsere Orchideen-Experten erklären Ihnen, wie die traditionelle Orchideenschau auf der Insel Mainau entsteht und beantworten gerne Ihre Fragen über die eleganten Zimmerpflanzen.
 </p>
 <p>
  Treffpunkt: Palmenhaus
  <br/>
  Dauer: ca. 60 Minuten
  <br/>
  Preis: 10 € pro Person zzgl. Inseleintritt
  <br/>
  Maximale Teilnehmerzahl: 20
 </p>
 <p>
  <em>
   Stand: März 2023
  </em>
 </p>
</div>
'),('Offene Parkführung: Treffpunkt Schlosshof (Donnerstag, 06.04.2023, 13:30)','2023-04-06','2023-10-08','Arboretum','das-beste-der-mainau_1080x720.jpg',12.00,1.00,NULL,NULL,'
Bis 8. Oktober 2023 bietet die Blumeninsel täglich um 13.30 Uhr eine besondere Führung an. Haben Sie Lust und Zeit mit uns die Mainau zu erkunden? Dann kommen Sie zum Vorplatz vom Schmetterlingshaus, denn dort wartet einer unserer Guides. Gemeinsam spazieren Sie durch den Park und erfahren Wissenswertes aus erster Hand.
In kurzweiligen 60 Minuten erfahren Sie Interessantes über die Geschichte der Insel Mainau, das Wirken der Familie Bernadotte und über den ein oder anderen Pflanzenschatz auf der Insel. Natürlich beantwortet unser Guide auch Ihre Fragen, z. B. zu gärtnerischen Themen, Botanik sowie Veranstaltungen.
Treffpunkt für die Führung: SchlosshofBeginn: 13.30 UhrMaximale Teilnehmerzahl: 20
Stand: März 2023, Änderungen vorbehalten
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Bis 8. Oktober 2023 bietet die Blumeninsel täglich um 13.30 Uhr eine besondere Führung an. Haben Sie Lust und Zeit mit uns die Mainau zu erkunden? Dann kommen Sie zum Vorplatz vom Schmetterlingshaus, denn dort wartet einer unserer Guides. Gemeinsam spazieren Sie durch den Park und erfahren Wissenswertes aus erster Hand.
 </p>
 <p>
  In kurzweiligen 60 Minuten erfahren Sie Interessantes über die Geschichte der Insel Mainau, das Wirken der Familie Bernadotte und über den ein oder anderen Pflanzenschatz auf der Insel. Natürlich beantwortet unser Guide auch Ihre Fragen, z. B. zu gärtnerischen Themen, Botanik sowie Veranstaltungen.
 </p>
 <p>
  <strong>
   Treffpunkt für die Führung:
  </strong>
  Schlosshof
  <br/>
  <strong>
   Beginn:
  </strong>
  13.30 Uhr
  <br/>
  <strong>
   Maximale Teilnehmerzahl:
  </strong>
  20
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten
  </em>
 </p>
</div>
'),('Offene Parkführung: Treffpunkt Vorplatz Schmetterlingshaus (Donnerstag, 06.04.2023, 11:30)','2023-04-06','2023-10-08','Schmetterlingshaus','das-beste-der-mainau_1080x720.jpg',12.00,1.00,NULL,NULL,'
Bis 8. Oktober 2023 bietet die Blumeninsel täglich um 11.30 Uhr eine besondere Führung an. Haben Sie Lust und Zeit mit uns die Mainau zu erkunden? Dann kommen Sie zum Vorplatz beim Schmetterlingshaus, denn dort wartet einer unserer Guides. Gemeinsam besuchen Sie dann das Arboretum, den Italienischen Rosengarten, das Palmenhaus und die Schlosskirche St. Marien und erfahren Wissenswertes aus erster Hand.
In kurzweiligen 60 Minuten erfahren Sie Interessantes über die Geschichte der Insel Mainau, das Wirken der Familie Bernadotte und über den ein oder anderen Pflanzenschatz auf der Insel. Natürlich beantwortet unser Guide auch Ihre Fragen, z. B. zu gärtnerischen Themen, Botanik sowie Veranstaltungen.
Treffpunkt für die Führung: Vorplatz SchmetterlingshausBeginn: 11.30 UhrMaximale Teilnehmerzahl: 20
Stand: März 2023, Änderungen vorbehalten
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Bis 8. Oktober 2023 bietet die Blumeninsel täglich um 11.30 Uhr eine besondere Führung an. Haben Sie Lust und Zeit mit uns die Mainau zu erkunden? Dann kommen Sie zum Vorplatz beim Schmetterlingshaus, denn dort wartet einer unserer Guides. Gemeinsam besuchen Sie dann das Arboretum, den Italienischen Rosengarten, das Palmenhaus und die Schlosskirche St. Marien und erfahren Wissenswertes aus erster Hand.
 </p>
 <p>
  In kurzweiligen 60 Minuten erfahren Sie Interessantes über die Geschichte der Insel Mainau, das Wirken der Familie Bernadotte und über den ein oder anderen Pflanzenschatz auf der Insel. Natürlich beantwortet unser Guide auch Ihre Fragen, z. B. zu gärtnerischen Themen, Botanik sowie Veranstaltungen.
 </p>
 <p>
  <strong>
   Treffpunkt für die Führung:
  </strong>
  Vorplatz Schmetterlingshaus
  <br/>
  <strong>
   Beginn:
  </strong>
  11.30 Uhr
  <br/>
  <strong>
   Maximale Teilnehmerzahl:
  </strong>
  20
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten
  </em>
 </p>
</div>
'),('Orchideen-Dinner 2023 (Samstag, 29.04.2023, 18:00)','2023-04-29','2023-04-29','Palmenhaus','orchideensoiree-2020.jpg',12.00,0.50,6.00,6.00,'
Inmitten rund 3.000 faszinierender Schönheiten der diesjährigen Orchideenschau erleben Sie im Palmenhaus einen für Augen, Ohren und Gaumen unvergesslichen Abend. Für musikalische Begleitung sorgt die Band Key & Strings.
Amuse gueule
Pikant gefüllte Reisblätter
**
Zweierlei vom Felchen an Spargelmousse
Vegetarisch:
Spargel Carpaccio an Portulak und Tomatenvinaigrette
 
***
Zitronen/Curry/Schaumsuppe mit Krabben
Vegetarisch:
Zitronen/Curry/Schaumsuppe mit Gemüse Julienne
***
Gurken/Gin Sorbet
***
Rosa gebratenes Rinderfilet/Bärlauch Kruste/
Petersilienpurre/ glasiertes Minigemüse
 
Vegetarisch:
Gefüllte Auberginenröllchen/ Venere Reis
 
***
 
Kandierte Lotuswurzel/ Yuzu Mousse/ Grünteesorbet
 
','<div class="ce_text text-center col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: left;">
  Inmitten rund 3.000 faszinierender Schönheiten der diesjährigen Orchideenschau erleben Sie im Palmenhaus einen für Augen, Ohren und Gaumen unvergesslichen Abend. Für musikalische Begleitung sorgt die Band Key &amp; Strings.
 </p>
 <p style="text-align: center;">
  <em>
   Amuse gueule
  </em>
 </p>
 <p style="text-align: center;">
  Pikant gefüllte Reisblätter
 </p>
 <p style="text-align: center;">
  **
 </p>
 <p style="text-align: center;">
  Zweierlei vom Felchen an Spargelmousse
 </p>
 <p style="text-align: center;">
  <em>
   Vegetarisch:
  </em>
 </p>
 <p style="text-align: center;">
  Spargel Carpaccio an Portulak und Tomatenvinaigrette
 </p>
 <p style="text-align: center;">
 </p>
 <p style="text-align: center;">
  ***
 </p>
 <p style="text-align: center;">
  Zitronen/Curry/Schaumsuppe mit Krabben
 </p>
 <p style="text-align: center;">
  <em>
   Vegetarisch:
  </em>
 </p>
 <p style="text-align: center;">
  Zitronen/Curry/Schaumsuppe mit Gemüse Julienne
 </p>
 <p style="text-align: center;">
  ***
 </p>
 <p style="text-align: center;">
  Gurken/Gin Sorbet
 </p>
 <p style="text-align: center;">
  ***
 </p>
 <p style="text-align: center;">
  Rosa gebratenes Rinderfilet/Bärlauch Kruste/
 </p>
 <p style="text-align: center;">
  Petersilienpurre/ glasiertes Minigemüse
 </p>
 <p style="text-align: center;">
 </p>
 <p style="text-align: center;">
  <em>
   Vegetarisch:
  </em>
 </p>
 <p style="text-align: center;">
  Gefüllte Auberginenröllchen/ Venere Reis
 </p>
 <p style="text-align: center;">
 </p>
 <p style="text-align: center;">
  ***
 </p>
 <p style="text-align: center;">
 </p>
 <p style="text-align: center;">
  Kandierte Lotuswurzel/ Yuzu Mousse/ Grünteesorbet
 </p>
 <p style="text-align: center;">
 </p>
</div>
'),('Orchideenschau 2023 (17.03.2023–07.05.2023)','2023-03-17','2023-08-07','Palmenhaus','orchideenschau-2018.jpg',5.00,0.50,2.50,NULL,'
Über 3 000 Exemplare faszinierender Orchideen-Schönheiten eröffnen mit ihrem Blütenreichtum das Mainau-Jahr 2023: Vom 17. März bis 7. Mai 2023 nehmen wir Sie mit auf eine Reise in die bunte Welt der Orchideen. Für 6 Wochen verwandelt sich das Palmenhaus in eine opulente Kulisse für die edlen Pflanzen. Dabei werden u.a. verschiedene Phalaeonopsis-Sorten in leuchtenden Rosa- und Weißtönen, Vanda-Orchideen, Cattleyen und exotische Raritäten kunstvoll von uns in Szene gesetzt.
Offene Führungen in der Orchideenschau13. April 2023, 11.30 bis 12.30 Uhr25. April 2023, 15.00 bis 16.00 Uhr
Orchideenverkaufsstand Im Rahmen der Orchideenschau findet täglich von 11.00 bis 15.00 Uhr ein Orchideenverkauf statt.
Stand: März 2023, weitere Informationen folgen
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Über 3 000 Exemplare faszinierender Orchideen-Schönheiten eröffnen mit ihrem Blütenreichtum das Mainau-Jahr 2023: Vom 17. März bis 7. Mai 2023 nehmen wir Sie mit auf eine Reise in die bunte Welt der Orchideen. Für 6 Wochen verwandelt sich das Palmenhaus in eine opulente Kulisse für die edlen Pflanzen. Dabei werden u.a. verschiedene Phalaeonopsis-Sorten in leuchtenden Rosa- und Weißtönen, Vanda-Orchideen, Cattleyen und exotische Raritäten kunstvoll von uns in Szene gesetzt.
 </p>
 <p>
  <strong>
   Offene Führungen in der Orchideenschau
   <br/>
  </strong>
  <a href="de/event-detail/offene-fuehrung-orchideenschau-13-04-23.html" title="Offene Führung in der Orchideenschau">
   <span style="text-decoration: underline;">
    13. April 2023, 11.30 bis 12.30 Uhr
   </span>
  </a>
  <br/>
  <a href="de/event-detail/offene-fuehrung-orchideenschau-25-04-23.html" title="Offene Führung in der Orchideenschau">
   <span style="text-decoration: underline;">
    25. April 2023, 15.00 bis 16.00 Uhr
   </span>
  </a>
 </p>
 <p>
  <strong>
   Orchideenverkaufsstand
  </strong>
  <br/>
  Im Rahmen der Orchideenschau findet täglich von 11.00 bis 15.00 Uhr ein Orchideenverkauf statt.
 </p>
 <p>
  <em>
   Stand: März 2023, weitere Informationen folgen
  </em>
 </p>
</div>
'),('Brunch: Karfreitag (Freitag, 07.04.2023, 10:30–14:30)','2023-04-07','2023-04-07','Restaurant Comturey','osterbrunch_1080x720.jpg',5.00,1.00,2.50,2.50,'
Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Karfreitag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
Stand: Februar 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Delikate Speisen und süße Leckereien erwarten Sie beim Osterbrunch auf der Insel Mainau: Unser Brunch am Karfreitag im Restaurant Comturey mit Blick auf den Bodensee verwöhnt Sie mit vielfältigen und leckeren Gaumenfreuden – von süß bis herzhaft, fruchtig bis knackig sowie vegetarischen Speisen. Für jeden ist etwas bei unserem reichhaltigen Büffet dabei - Kaffee, Tee und Saft sind inklusive.
  <br/>
  <br/>
  Nach einem ausgiebigem Brunch empfehlen wir Ihnen einen entschleunigten Spaziergang über die Blumeninsel. Flanieren Sie durch die Frühlingsallee mit ihrem Tulpenmeer oder besuchen Sie die Orchideenschau im Palmenhaus.
 </p>
 <p>
  In Verbindung mit einer Reservierung oder Buchung ist der Eintritt auf die Insel Mainau inklusive und Sie können bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: Februar 2023
  </em>
 </p>
</div>
'),('Osterprogramm 2023 (07.04.2023–10.04.2023)','2023-04-07','2023-04-10','Staudengarten','osterprogramm-2018.jpg',5.00,0.50,NULL,NULL,'
Neben Attraktionen wie die Orchideenschau im Palmenhaus oder die Verkaufsausstellung "Frühlingsträume" im Wappensaal von Schloss Mainau, eine bunte Frühlingsblüte im Park sowie ein vielfältiges Osterangebot für die ganze Familie auf der Blumeninsel Mainau:
Kulinarische Programmpunkte:
Offene WeinprobeTreffpunkt Torbogenkeller, 7 € pro Person7., 9. und 10. April 2023: 12.00 & 15.00 Uhr, Dauer: ca. 30 Minuten8. April nur 12.00 UhrBrunch am Karfreitag (Restplätze vorhanden), Ostersonntag & Ostermontag - AUSGEBUCHTRestaurant Comturey & Torkelkeller
Ostern im Park:
Offene Parkführung ab Vorplatz Schmetterlingshaus, 6 € pro Person, Kinder bis 12 Jahre freitäglich 11.30 Uhr, Dauer: ca. 60 Minuten
ab Schlosshof, 6 € pro Person, Kinder bis 12 Jahre freitäglich 13.30 Uhr, Dauer: ca. 60 Minuten
Kinderschatzsuche kostenfreies Angebot für die ganze Familie
Schlossführung am OstersonntagTreffpunkt Schlosshof, 15 € pro Person12.00 Uhr, Dauer: ca. 60 Minuten
Ostereier-Blumenskulptur im SchlosshofDie Mainau-Gärtner haben farbenfrohe Frühlingsblüher wie Hornveilchen, Ranunkeln und Primeln als buntes Osternest vor der barocken Schlosskulisse arrangiert.
Stand: März 2023, Änderungen vorbehalten
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Neben Attraktionen wie die
  <a href="de/event-detail/orchideenschau-2023.html" title="Orchideenschau 2023 | Insel Mainau">
   Orchideenschau
  </a>
  im Palmenhaus oder die
  <a href="de/event-detail/ausstellung-fruehlingstraeume-2023.html" title="Ausstellung ">
   Verkaufsausstellung "Frühlingsträume"
  </a>
  im Wappensaal von Schloss Mainau, eine bunte Frühlingsblüte im Park sowie ein vielfältiges Osterangebot für die ganze Familie auf der Blumeninsel Mainau:
 </p>
 <h5>
  Kulinarische Programmpunkte:
 </h5>
 <p>
  <strong>
   Offene Weinprobe
  </strong>
  <br/>
  Treffpunkt Torbogenkeller, 7 € pro Person
  <br/>
  <em>
   7., 9. und 10. April 2023: 12.00 &amp; 15.00 Uhr, Dauer: ca. 30 Minuten
   <br/>
   8. April nur 12.00 Uhr
  </em>
  <strong>
   <br/>
   <br/>
   Brunch am Karfreitag (Restplätze vorhanden), Ostersonntag &amp; Ostermontag - AUSGEBUCHT
  </strong>
  <br/>
  Restaurant Comturey &amp; Torkelkeller
 </p>
 <h5>
  Ostern im Park:
 </h5>
 <p>
  <strong>
   Offene Parkführung
   <br/>
  </strong>
  ab Vorplatz Schmetterlingshaus, 6 € pro Person, Kinder bis 12 Jahre frei
  <br/>
  <em>
   täglich 11.30 Uhr, Dauer: ca. 60 Minuten
  </em>
 </p>
 <p>
  ab Schlosshof, 6 € pro Person, Kinder bis 12 Jahre frei
  <br/>
  <em>
   täglich 13.30 Uhr, Dauer: ca. 60 Minuten
  </em>
 </p>
 <p>
  <strong>
   <a href="event-detail/kinderschatzsuche-2023.html" title="Kinderschatzsuche | Insel Mainau">
    Kinderschatzsuche
   </a>
  </strong>
  <br/>
  kostenfreies Angebot für die ganze Familie
 </p>
 <p>
  <strong>
   Schlossführung am Ostersonntag
   <br/>
  </strong>
  Treffpunkt Schlosshof, 15 € pro Person
  <br/>
  <em>
   12.00 Uhr, Dauer: ca. 60 Minuten
  </em>
 </p>
 <p>
  <strong>
   Ostereier-Blumenskulptur im Schlosshof
  </strong>
  <br/>
  Die Mainau-Gärtner haben farbenfrohe Frühlingsblüher wie Hornveilchen, Ranunkeln und Primeln als buntes Osternest vor der barocken Schlosskulisse arrangiert.
 </p>
 <p>
  <em>
   Stand: März 2023, Änderungen vorbehalten
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Freitag, 01.09.2023, 18:00)','2023-09-01','2023-09-01','Barockschloss','zu-gast-im-hause-bernadotte.jpg',5.00,NULL,NULL,NULL,'
Am 1. September 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Am 1. September 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Samstag, 02.09.2023, 18:00)','2023-09-02','2023-09-02','Barockschloss','zu-gast-im-hause-bernadotte.jpg',6.00,NULL,3.00,NULL,'
Am 2. September 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Am 2. September 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Freitag, 04.08.2023, 18:00)','2023-08-04','2023-08-04','Barockschloss','zu-gast-im-hause-bernadotte.jpg',6.00,NULL,3.00,NULL,'
Am 4. August 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Am 4. August 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Samstag, 05.08.2023, 18:00)','2023-08-05','2023-08-05','Barockschloss','zu-gast-im-hause-bernadotte.jpg',6.00,NULL,3.00,NULL,'
Am 5. August 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Am 5. August 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Freitag, 26.05.2023, 18:00)','2023-05-26','2023-05-26','Barockschloss','zu-gast-im-hause-bernadotte.jpg',6.00,NULL,3.00,NULL,'
Information vom 31. März 2023Die Veranstaltung ist ausgebucht.
Am 26. Mai 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p style="text-align: center;">
  <span class="fehler">
   <strong>
    Information vom 31. März 2023
   </strong>
   <br/>
   Die Veranstaltung ist ausgebucht.
  </span>
 </p>
 <p>
  Am 26. Mai 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Pop-Up-Restaurant im Schloss (Samstag, 27.05.2023, 18:00)','2023-05-27','2023-05-27','Barockschloss','zu-gast-im-hause-bernadotte.jpg',6.00,NULL,3.00,NULL,'
Am 27. Mai 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
Beginn: 18.00 UhrMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 79,00 € zzgl. GetränkeDresscode-Vorschlag: Festlich elegant
Außerdem:Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
Stand: 31.03.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Am 27. Mai 2023 gibt es in unserem Barockschloss für einen Abend ein exklusives Pop-Up-Restaurant. Es erwartet Sie ein 4-Gänge-Überraschungsmenü sowie kurzweilige und humorvolle Unterhaltung zwischen den Gängen! Bitte entscheiden Sie sich bei der Buchung im Webshop für eine Menüvariante.
 </p>
 <p>
  Beginn: 18.00 Uhr
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 79,00 €
  <strong>
   zzgl.
  </strong>
  Getränke
  <br/>
  <br/>
  Dresscode-Vorschlag: Festlich elegant
 </p>
 <p>
  <span style="text-decoration: underline;">
   Außerdem:
   <br/>
  </span>
  Bei Buchung der Veranstaltung erhalten Sie ab 17.00 Uhr freien Eintritt auf die Insel Mainau und dürfen bis zum Parkplatz Schwedenschenke auffahren.
 </p>
 <p>
  <em>
   Stand: 31.03.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Sonntag, 01.10.2023, 14:30–17:00)','2023-10-01','2023-10-01','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Montag, 02.10.2023, 14:30–17:00)','2023-10-02','2023-10-02','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Dienstag, 03.10.2023, 14:30–17:00)','2023-10-03','2023-10-03','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Donnerstag, 08.06.2023, 14:30–17:00)','2023-06-08','2023-06-08','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Freitag, 09.06.2023, 14:30–17:00)','2023-06-09','2023-06-09','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Samstag, 10.06.2023, 14:30–17:00)','2023-06-10','2023-06-10','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Sonntag, 11.06.2023, 14:30–17:00)','2023-06-11','2023-06-11','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Freitag, 29.09.2023, 14:30–17:00)','2023-09-29','2023-09-29','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Teatime im Schloss (Samstag, 30.09.2023, 14:30–17:00)','2023-09-30','2023-09-30','Barockschloss','teatime-2022.jpg',6.00,1.00,3.00,NULL,'
Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
Beginn: 14.30 Uhr, Treffpunkt: Eingang SchlosskircheMindestteilnehmerzahl: 10 Personen Max. 20 PersonenPreis pro Person: 28,00 €  zzgl. Inseleintritt / alle weiteren Getränke nach Verbrauch
Stand: 20.02.2023, Änderungen vorbehalten. 
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Freuen Sie sich auf eine klassische Teatime im Barockschloss Mainau. Wir servieren Ihnen exklusiv im stilvollen Ambiente feinen Tee sowie verschiedene süße und herzhafte Snacks auf einer Etagere. Damit Sie sich auf einen gemütlichen Nachmittag einstimmen können, verwöhnen wir Sie außerdem mit einem Glas Prosecco.
 </p>
 <p>
  Beginn: 14.30 Uhr, Treffpunkt: Eingang Schlosskirche
  <br/>
  <br/>
  Mindestteilnehmerzahl: 10 Personen
  <br/>
  Max. 20 Personen
  <br/>
  <br/>
  Preis pro Person: 28,00 €  zzgl. Inseleintritt
  <strong>
   /
  </strong>
  alle weiteren Getränke nach Verbrauch
 </p>
 <p>
  <em>
   Stand: 20.02.2023, Änderungen vorbehalten.
  </em>
 </p>
</div>
'),('Tomatenrondell (14.08.2023–20.08.2023)','2023-08-14','2023-08-20','Platanenweg 5','tomatenrondell.jpg',12.50,2.00,6.25,6.25,'
Vom 14. August bis 20. August 2023 dreht sich im Platanenweg 5 wieder alles um die Tomate. Auf einem Rondell wird die schmackhafte Frucht in ihren vielfältigen Variationen zur Schau gestellt. Tomaten-Experte Michael Schick beantwortet vor Ort (ca. 10.00 Uhr bis 16.00 Uhr) Fragen rund um die aus Südamerika stammende Pflanze und gibt Tipps zum Schutz gegen die Kraut- und Braunfäule. Außerdem können die ausgestellten Tomatenpflanzen in Form von Saatgut käuflich erworben werden.
Stand: Januar 2023
','<div class="ce_text col-xs-12 col-sm-12 col-md-12 col-lg-12 block">
 <p>
  Vom 14. August bis 20. August 2023 dreht sich im Platanenweg 5 wieder alles um die Tomate. Auf einem Rondell wird die schmackhafte Frucht in ihren vielfältigen Variationen zur Schau gestellt. Tomaten-Experte Michael Schick beantwortet vor Ort (ca. 10.00 Uhr bis 16.00 Uhr) Fragen rund um die aus Südamerika stammende Pflanze und gibt Tipps zum Schutz gegen die Kraut- und Braunfäule. Außerdem können die ausgestellten Tomatenpflanzen in Form von Saatgut käuflich erworben werden.
 </p>
 <p>
  <br/>
  <em>
   Stand: Januar 2023
  </em>
 </p>
</div>
');

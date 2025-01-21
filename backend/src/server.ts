import app from './app';

/**
 *  Zeige TypeScript Zeile in Fehlernachrichten
 */
import SourceMap from 'source-map-support';
SourceMap.install();

/**
 *  Hier starten wir den Express-Server, indem wir den Server an einen Netzwerkport (Standard: 80) binden
 */
app.listen(app.get('port'), () => {
  console.log(
    'Server running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop\n');
});

/*
#########################################################
###                                                   ###
###    PROGETTO DI ESTRAZIONE DATI CATASTALI          ###
###                                                   ###
######################################################### 

A PROPOSITO:
QUESTO PROGETTO: è stato dedicato a fornire un meccanismo per l'accesso ai dati precedentemente archiviati in un database DBF e estratti tramite un interfaccia che andava sul sistema MsDos, che sono stati successivamente convertiti. Il risultato finale è un bot Discord che permette agli utenti di estrarre dati mediante comandi interattivi.
QUESTO PROGETTO: si concentra sull'estrazione di dati da un database catastale ( LOCALE ( paricelle.json || anagrafica.json)).
QUESTO PROGETTO: e' stato possibile grazie agli sforzi congiunti dei seguenti sviluppatori:

- [Nicholas Patricolo] - (Ruolo: Conversione dati da DBF a JSON || Full stack discord bot dev.) 
- [Manuel De Flavis] -   (Ruolo:  Full stack discord bot dev.)

I dati estratti dal database catastale includono informazioni cruciali come le proprietà, i proprietari, i valori catastali, ecc.

Riconoscimenti Database:

- Nome del Database: []
*/

const Discord = require('discord.js');
const config = require('./config.json');
const JsonParticelle = require('./particelle.json');
const JsonAnagrafica = require('./anagrafica.json');

const client = new Discord.Client();
const prefisso_inizio_cmd = config.prefisso_inizio_cmd;
const cmd_cerca_particella = config.cmd_cerca_particella;
const cmd_cerca_anagrafica = config.cmd_cerca_anagrafica;

client.login(config.token);
client.on('ready', () => {
  console.log(`Lo script si e' connesso correttamente! il bot si chiama: ${client.user.tag}`);
});
client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith(prefisso_inizio_cmd)) return;
  const args = message.content.slice(prefisso_inizio_cmd.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === cmd_cerca_particella) {
    if (args.length === 2) {
      const foglioDaCercare = parseInt(args[0]);
      const numeroDaCercare = parseInt(args[1]);
      //--------- BLOCCO RICERCA DATO -------------------
      // Cerca nel file JSON ( particelle.json )
      const particella = JsonParticelle.data.find((item) => {
        return item.FOGLIO === foglioDaCercare && item.NUMERO === numeroDaCercare;
      });
      if (particella !== undefined) {
        const intest = JsonAnagrafica.data.filter((item) => {
          return item.PARTITA === particella.PARTITA;
        });
        // ------------ EMBED -----------------------------------------------------------------
        message.channel.send(embedDatiParticella(particella));
        message.channel.send(embedIntestatriParticella(intest));
      }
      else{
        //message.reply('Nessun risultato trovato per FOGLIO e PARTICELLA specificati.')
        const embed = new Discord.MessageEmbed()
      .setTitle('Nessun risultato trovato per FOGLIO e PARTICELLA specificati.')
      .setColor('#ff0000')
      .setThumbnail(config.img_errore);//https://icons.iconarchive.com/icons/icojam/blue-bits/256/database-check-icon.png
       message.channel.send(embed);
      }
    } else {
      //message.reply('Utilizzo del comando errato. Usa `!p <FOGLIO> <PARTICELLA>`.');
      const embed = new Discord.MessageEmbed()
      .setTitle('Utilizzo del comando errato. Usa `!p <FOGLIO> <PARTICELLA>')
      .setColor('#ff0000')
      .setThumbnail(config.img_errore);//https://icons.iconarchive.com/icons/icojam/blue-bits/256/database-check-icon.png
       message.channel.send(embed);
    }
  }
  if (command === cmd_cerca_anagrafica) {
    if (args.length === 2) {
      const cognomeDaCercare = args[0].toUpperCase();
      const nomeDaCercare = args[1].toUpperCase();
     //------------ Cerca nel file JSON ( anagrafica.json ) ------------
      const partite = JsonAnagrafica.data.filter((item) => {
        return item.COGNOME === cognomeDaCercare && item.NOME === nomeDaCercare;
      });

      if(partite !== undefined){
        message.channel.send(embedParticelle(partite));
      }
      else {
        //message.reply('Nessun risultato trovato per COGNOME e NOME specificati.');
        const embed = new Discord.MessageEmbed()
        .setTitle(`Nessun risultato trovato per COGNOME e NOME specificati.`)
        .setColor('#ff0000')
        .setThumbnail(config.img_errore);
         message.channel.send(embed);
      }
    } else {
      //message.reply('Utilizzo del comando errato. Usa `!a <COGNOME> <NOME>`.');
      const embed = new Discord.MessageEmbed()
      .setTitle('Utilizzo del comando errato. Usa `!a <COGNOME> <NOME>.')
      .setColor('#ff0000')
      .setThumbnail(config.img_errore);
       message.channel.send(embed);
    }
  }
});




function embedDatiParticella(particella){
  const embed = new Discord.MessageEmbed()
  embed.setTitle(`INFORMAZIONI PARTICELLA: ${particella.NUMERO} FOGLIO: ${particella.FOGLIO}`);
  let body = `ETTARI: ${particella.ETTARI}\nARE: ${particella.ARE}\nCENTIARE: ${particella.CENTIARE}\nCLASSE: ${particella.CLASSE}`;
  embed.setDescription(body);
  embed.setThumbnail(config.img_informazioni_particella);//-->ICONA INFORMAZIONI PARTICELLA
  embed.setTimestamp();
  return embed;
}

function embedIntestatriParticella(intestatari){
  const embed = new Discord.MessageEmbed()
  embed.setTitle("INTESTATARI PARTICELLA");
  let body = "";//-->Variabile vuota tanto si va ad aggiungere al ciclo quando ricerca i dati!
  intestatari.forEach(intestatario => {
    console.log(intestatario);
    body += `NOME: ${intestatario.NOME}\nCOGNOME: ${intestatario.COGNOME}\nDATA: ${formatDate(intestatario.DATA)}\n\n`
  })
  embed.setDescription(body);
  embed.setTimestamp();
  embed.setThumbnail(config.img_intestatari_particella);
  embed.setFooter('La proprietà di questa particella è condivisa tra : ' + intestatari.length + ' Prorprietari')
  return embed;
}

function embedParticelle(partite){
  const embed = new Discord.MessageEmbed()
  embed.setTitle(`PARTICELLE DI: ${partite[0].COGNOME} ${partite[0].NOME}`);
  let totParticelle = 0;
  let body = "";
  partite.forEach(partita => {
    const particellePartita = JsonParticelle.data.filter((item) => {
      return item.PARTITA === partita.PARTITA;
    });
    body += `PARTITA: ${partita.PARTITA}\n\n`;
    particellePartita.forEach(particella => {
      totParticelle ++;
      body += `F: ${particella.FOGLIO}\n`;
      body += `PART: ${particella.NUMERO}\n`;
    })
    body += "\n";
  })
  embed.setDescription(body);
  embed.setTimestamp();
  embed.setFooter("Totale particelle: " + totParticelle)
  embed.setThumbnail(config.img_intestatari_particella_anagrafica);
  return embed;
}

function formatDate(date){
  const dataNascita = String(date);
  if(date !== '')
    new Date()
    return new Date(dataNascita.substring(0, 4), dataNascita.substring(4,6), parseInt(dataNascita.substring(5,7) +1 ).toString()).toLocaleDateString();
  return "-";
}

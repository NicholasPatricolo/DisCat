//------------ LIB -----------------------------------------------------------------------
const Discord = require('discord.js');
const fs = require('fs');
//------------ IMPOSTAZIONI --------------------------------------------------------------
const client = new Discord.Client();
const prefisso_inizio_cmd = '?';
const cmd_cerca_particella = 'p';
const cmd_cerca_anagrafica = 'a';
//------------ JSON ----------------------------------------------------------------------
const JsonParticelle = require('./particelle.json');
const JsonAnagrafica = require('./anagrafica.json'); 

client.on('ready', () => {
  console.log(`Lo script si e' connesso correttamente! il bot si chiama: ${client.user.tag}`);
});

client.on('message', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefisso_inizio_cmd)) return;
  const args = message.content.slice(prefisso_inizio_cmd.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === cmd_cerca_particella) {
    if (args.length === 2) {
      const foglioDaCercare = parseInt(args[0]);
      const numeroDaCercare = parseInt(args[1]);
      //--------- BLOCCO RICERCA DATO -------------------
      // Cerca nel file JSON ( particelle.json )
      const risultati1 = JsonParticelle.data.filter((item) => {
        return item.FOGLIO === foglioDaCercare && item.NUMERO === numeroDaCercare;
      });
      if (risultati1.length > 0) {
        risultati1.forEach((risultato) => {
          const partita = risultato.PARTITA;
          // Cerca nel file JSON ( anagrafica.json )
          const risultati2 = JsonAnagrafica.data.filter((item) => {
            return item.PARTITA === partita;
          });
          //------------ Array inseribili a condizione che vengano rispettati dal/i file JSON ------------
          let intestatari = [];
          risultati2.forEach(intestatario => {
            intestatari.push({
              nome: intestatario.NOME,
              cognome: intestatario.COGNOME,
              sesso: intestatario.SESSO
            });
          });
          risultato.intestatari = intestatari;
          let infoparticelle = [];
          risultati1.forEach(infoparticella => {
            infoparticelle.push({
              ettari: infoparticella.ETTARI,
              are: infoparticella.ARE,
              centiare: infoparticella.CENTIARE 
            });
          });
          risultato.infoparticelle = infoparticelle;
          // ------------ STRINGHE RISULTATI -----------------------------------------------------
          let s_info_personali = '### INFORMAZIONI PERSONALI\n';
          intestatari.forEach((intestatario, index) => {
            s_info_personali += `NOME: *${intestatario.nome}*\nCOGNOME: *${intestatario.cognome}*\nSESSO: *${intestatario.sesso}*\n`;
            if (index < intestatari.length - 1) {
              s_info_personali += '\n'; 
            }
          });
          let s_info_part = '### INFORMAZIONI PARTICELLA\n';
          infoparticelle.forEach((infoparticella, index) => {
            s_info_part += `ETTARI: *${infoparticella.ettari}*\nARE: *${infoparticella.are}*\nCENTIARE: *${infoparticella.centiare}*\n`;
            if (index < infoparticelle.length - 1) {
              s_info_part += '';
            }
          });
          // ------------ EMBED -----------------------------------------------------------------
          const embed = new Discord.MessageEmbed()
            .setTitle(`Informazioni relativa alla ricerca del FOGLIO *${foglioDaCercare}* e NUMERO *${numeroDaCercare}*\n`)
            .setDescription(s_info_personali +  '\n' + s_info_part) // Informazioni Personali > Informazioni Particella
          message.channel.send(embed);
        });
      } else {
        message.reply('Nessun risultato trovato per FOGLIO e NUMERO specificati.');
      }
    } else if (args.length === 1 && args[0] === 'partita') {
      // ...
    }
  }
  if (command === cmd_cerca_anagrafica) {
    if (args.length === 2) {
      const cognomeDaCercare = args[0]; // Non è necessario il parsing
      const nomeDaCercare = args[1]; // Non è necessario il parsing
     //------------ Cerca nel file JSON ( anagrafica.json ) ------------
      const risultati1 = JsonAnagrafica.data.filter((item) => {
        return item.COGNOME === cognomeDaCercare && item.NOME === nomeDaCercare;
      });
  
      if (risultati1.length > 0) {
        risultati1.forEach((risultato) => {
          const partita = risultato.PARTITA;
          //------------ Cerca nel file JSON ( particelle.json ) ------------
          const risultati2 = JsonParticelle.data.filter((item) => {
            return item.PARTITA === partita;
          });
          //------------ Array inseribili a condizione che vengano rispettati dalL/i file JSON ------------
          let intestatari = [];
          risultati2.forEach(intestatario => {
            intestatari.push({
              foglio: intestatario.FOGLIO,
              numero: intestatario.NUMERO,
              partita: intestatario.PARTITA
            });
          });
           // ------------ STRINGHE RISULTATI INFORMAZIONI PERSONALI -----------------------------------------------------
          let s_info_personali = `### INFORMAZIONI ANAGRAFICHE\n`;
          s_info_personali += `COGNOME: *${cognomeDaCercare}*\nNOME: *${nomeDaCercare}*\nSESSO: *${risultato.SESSO}*\n`;
           // ------------ STRINGHE RISULTATI TUTTE LE PARTICELLE CHE POSSIEDE QUELL NOMINATIVO -----------------------------------------------------
          let s_info_part = "> ### INFORMAZIONI PARTICELLA\n";
          intestatari.forEach((intestatario, index) => {
            s_info_part += `FOGLIO: *${intestatario.foglio}*\nNUMERO: *${intestatario.numero}*\nPARTITA: *${intestatario.partita}*\n`;
            if (index < intestatari.length - 1) {
              s_info_part += '\n';
            }
          });
          // ------------ EMBED -----------------------------------------------------------------
          const embed = new Discord.MessageEmbed()
            .setTitle(`la ricerca ha avuto esito positivo! *${partita}*`)
            .setDescription(s_info_personali + '\n' + s_info_part);
          message.channel.send(embed);
          
        });
      } else {
        message.reply('Nessun risultato trovato per COGNOME e NOME specificati.');
      }
    } else {
      message.reply('Utilizzo del comando errato. Usa `!a <COGNOME> <NOME>`.');
    }
  }
});


const token = 'MTE2MTE3Mjc4MDExMzQ3MzYxNg.GxiVKz.wf0qaRoWWyg7B5PUCRZgWOXc5zAPy9Ac1xo1pY';

client.login(token);
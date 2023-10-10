const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const prefix = '?'; // Simbolo con quale vuoi far iniziare il comando
const comando = 'cerca';

const JsonParticelle = require('./particelle.json'); // Sostituisci con il percorso corretto del primo file JSON

const JsonAnagrafica = require('./anagrafica.json'); // Sostituisci con il percorso corretto del secondo file JSON

client.on('ready', () => {
  console.log(`Lo script si e' connesso correttamente! il bot si chiama: ${client.user.tag}`);
});

client.on('message', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === comando) {
    if (args.length === 2) {
      const foglioDaCercare = parseInt(args[0]);
      const numeroDaCercare = parseInt(args[1]);
      //--------- BLOCCO RICERCA DATO -------------------
      // Cerca nel primo file JSON
      const risultati1 = JsonParticelle.data.filter((item) => {
        return item.FOGLIO === foglioDaCercare && item.NUMERO === numeroDaCercare;
      });

      const partita = risultati1[0].PARTITA;

      // Cerca nel secondo file JSON
      const risultati2 = JsonAnagrafica.data.filter((item) => {
        return item.PARTITA === partita;
      });

      let intestatari = [];

      risultati2.forEach(intestatario => {
        intestatari.push({
          nome: intestatario.NOME,
          cognome: intestatario.COGNOME
        })
      })

      risultati1[0].intestatari = intestatari;

      console.log(risultati1);
      if (risultati1.length > 0) {
        risultati1.forEach((risultato) => {
          // ManipolazioneStringaRisultato con questo manopoli il risultato della stringa facndogli scrivere quello che vuoi tu a patto che sia presente nel file json
         // const ManipolazioneStringaRisultato = `### INFORMAZIONI PERSONALI\n NOME: ${risultato.NOME}\nCOGNOME: ${risultato.COGNOME}\nSUP: ${risultato.SUPPLEMEN}\n### INFORMAZIONI PARTICELLA\n ETTARI: ${risultato.ETTARI}\ARE: ${risultato.ARE}\CENTIARE: ${risultato.CENTIARE}`;
         //--------- EMBED ( OGGETTO DOVE VENGONO STAMPATE TUTTE LE STRINGHE) -------------------
          const embed = new Discord.MessageEmbed()
            .setTitle(`Informazioni per FOGLIO ${foglioDaCercare} e NUMERO ${numeroDaCercare}`)
           .setDescription(JSON.stringify(risultato, null, 2))
           //.setDescription(ManipolazioneStringaRisultato)
            .setColor('#00ff00');
           //--------- EMBED ( OGGETTO DOVE VENGONO STAMPATE TUTTE LE STRINGHE) -------------------
          message.channel.send(embed);// Visualizza L'embd in chat
        });
      } else {
        message.reply('Nessun risultato trovato per FOGLIO e NUMERO specificati.');
      }
    } else if (args.length === 1 && args[0] === 'partita') {
      const partitaDaCercare = parseInt(args[1]);

      // Cerca solo nel secondo file JSON (per la "PARTITA")
      const risultatiPartita = JsonAnagrafica.data.filter((item) => {
        return item.PARTITA === partitaDaCercare;
      });

      if (risultatiPartita.length > 0) {
        const ManipolazioneStringaRisultato = `NOME: ${risultato.NOME}\nCOGNOME: ${risultato.COGNOME}`;
        risultatiPartita.forEach((risultato) => {
          const embed = new Discord.MessageEmbed()
            .setTitle(`Intestatario  ${partitaDaCercare} e NUMERO ${numeroDaCercare}`)
            .setDescription(JSON.stringify(risultato, null, 2))
            .setColor('#00ff00');

          message.channel.send(embed);
        });
      } else {
        message.reply('Nessun risultato trovato per la PARTITA specificata.');
      }
    }
  }
});

const token = 'MTE2MTM0MTE5MDM4NjQ4NzUwOQ.GIDWHe.Z3FL05mKsN_tdVFycNLnwxYyAkhgbrEFs1wt34';
client.login(token);

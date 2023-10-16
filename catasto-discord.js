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
        message.reply('Nessun risultato trovato per FOGLIO e PARTICELLA specificati.')
      }
    } else {
      message.reply('Utilizzo del comando errato. Usa `!p <FOGLIO> <PARTICELLA>`.');
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
        message.reply('Nessun risultato trovato per COGNOME e NOME specificati.');
      }
    } else {
      message.reply('Utilizzo del comando errato. Usa `!a <COGNOME> <NOME>`.');
    }
  }
});

function embedIntestatriParticella(intestatari){
  const embed = new Discord.MessageEmbed()
  embed.setTitle("INTESTATARI PARTICELLA");
  let body = "PROPRIETARI: " + intestatari.length +"\n\n";
  intestatari.forEach(intestatario => {
    console.log(intestatario);
    body += `NOME: ${intestatario.NOME}\nCOGNOME: ${intestatario.COGNOME}\nDATA: ${formatDate(intestatario.DATA)}\n\n`
  })
  embed.setDescription(body);
  embed.setTimestamp();
  embed.setFooter("Vai! ruba la legna!")
  return embed;
}

function embedDatiParticella(particella){
  const embed = new Discord.MessageEmbed()
  embed.setTitle(`INFORMAZIONI PARTICELLA: ${particella.NUMERO} FOGLIO: ${particella.FOGLIO}`);
  let body = `ETTARI: ${particella.ETTARI}\nARE: ${particella.ARE}\nCENTIARE: ${particella.CENTIARE}\n`;
  embed.setDescription(body);
  embed.setTimestamp();
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
  return embed;
}

function formatDate(date){
  const dataNascita = String(date);
  if(date !== '')
    new Date()
    return new Date(dataNascita.substring(0, 4), dataNascita.substring(4,6), parseInt(dataNascita.substring(5,7) +1 ).toString()).toLocaleDateString();
  return "-";
}
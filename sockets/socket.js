const {io} = require('../index.js');
const Bands = require('../models/bands.js');
const Band = require('../models/band.js');

const bands = new Bands();

bands.addBand( new Band( 'Pink Floid' ));
bands.addBand( new Band( 'Aerosmith' ));
bands.addBand( new Band( 'Queen' ));
bands.addBand( new Band( 'Oasis' ));

// Mensajes de sockets
io.on('connection', client => {

    console.log('Cliente conectado...');

    client.emit('active-bands', bands.getBands() );
    client.on('disconnect', () => {
        console.log('Cliente desconectado...');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     //console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // });
});
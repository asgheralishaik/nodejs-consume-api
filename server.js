// server.js

'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');

const server = new Hapi.Server();

server.connection({
    host: '127.0.0.1',
    port: 3000
});

// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});

// Show teams standings
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var headers = {
            'X-Auth-Token': '33c929f61a0347e58969e10acae181a0'
        };
        var url = 'https://api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL';
        Request.get({ headers: headers, url}, function (error, response, body) {
            if (error) {
                throw error;
            }

            const data = JSON.parse(body);
            reply.view('index', { result: data });
        });
    }
});

// A simple helper function that extracts team ID from team URL
Handlebars.registerHelper('id', function (teamUrl) {
    return teamUrl.slice(38);
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
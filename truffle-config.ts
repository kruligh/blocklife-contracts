const gas = 3000000;
const host = 'localhost';
const port = 8545;

export = {
    mocha: {
        useColors: true
    },
    networks: {
        testrpc: {
            gas,
            gasPrice: 0,
            host,
            network_id: '*',
            port
        }
    }
};

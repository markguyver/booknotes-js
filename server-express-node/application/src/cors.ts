import cors from 'cors';

// TODO: Configure Usage of ENV Settings (We're EXTREMELY Permissable, in the meantime)

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

export const corsConfiguration = cors(corsOptions);
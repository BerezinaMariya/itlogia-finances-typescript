const host: string | undefined = process.env.HOST;

type ConfigType = {
    host: string | undefined,
    api: string
}

const config: ConfigType = {
    host: host,
    api: host + '/api'
}

export default config;

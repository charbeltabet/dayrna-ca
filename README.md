### Development

1. Run the development server
```
bin/dev
```
If you want to add `binding.pry` breakpoints in rails:
```
rails s
bin/vite dev
```

2. Daisy UI style [style](https://daisyui.com/theme-generator/#theme=eJyVk9tugzAMQH8FMU3apDXKBUjYW9fS_0iDKWiUoAS0m_bvS6CauLST9hgf-8Q24Sts5BnC51CVvVFl-BQqXWuzsaqEIV5Xp7Jz4c1mBEdpYUMwdujuwDK-y5aQXuDLgWeHJWQjzF72YrtfQqWbDprOJ0SxuyOaJLSmOkvz4dke8y2N12xav7rdgqP5aNCvtSofRHofYIRjHtCUISrY47X0iXQso3wo4zQgjCKC02mZVOrSwC5OebRbof_pGug7I-urC7mwlTAVgxCTgOAERXQ2VtUU2tsSQbIdXYC1auyNRAGNI5TgaLah3g1krbdhtsWMrtmt3pyQCIw4nfrepGmq5jR8vJj7R7RiN31JwBlKxKw_MEYbbxM5kSxZkj-GZRFDJBWjzMi86q17DzWobhBiA-cpKiqo8yvxo36fRm31CTMNovGM_Xom4KhNDj6btO9DIIe2K_15ODW6sv4n9bvKoZB97ebpTA9PYWugAGPdE34NnwtZW_j-Aeu6JA0)

#### Database
1- Create a pg db:
```sh
docker run --name pg-dev-db \
  -e POSTGRES_USER=devuser \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=TolleLegeOs \
  -p 5432:5432 \
  -d postgres
```

2- Access psql
```sh
dayrna-ca % psql -h localhost -p 5432 -U devuser -d dayrna_ca_development
```

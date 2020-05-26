# UP in Local Machine!

# Requisitos

- nodejs e npm 
- react-scripts@3.4.1

### Criando ambiente de Debug

Na pasta raiz do projeto executar:
> npm install
>  npm install react-scripts@3.4.1

Para iniciar a versão de debug:
> npm run start
 

# Deploy in Production

## Ambiente
	> Ubuntu 18.04
	> Nginx ( inside docker)

Atualmente o docker na AWS está com problemas em conectar no npm registry.
Para contornar o problema a primeira parte do Dockerfile Multistage é feita manualmente resultando na modificação do Dockerfile em uso na produção.


### Dockerfile multiStage
> Pode ser utilizado na máquina local
```
#build environment
FROM node:14.2.0-stretch as build
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
RUN npm install react-scripts@3.4.1
COPY . .
RUN npm run build

# production environment

FROM  nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY  build  /usr/share/nginx/html
COPY  nginx/nginx.conf  /etc/nginx/conf.d/default.conf
COPY  nginx/letsencrypt/  /etc/letsencrypt
EXPOSE  80  443
CMD  ["nginx",  "-g",  "daemon  off;"]

```
## Dockerfile usado na AWS

```
# production environment
FROM  nginx:stable-alpine
COPY  build  /usr/share/nginx/html
COPY  nginx/nginx.conf  /etc/nginx/conf.d/default.conf
COPY  nginx/letsencrypt/  /etc/letsencrypt
EXPOSE  80  443
CMD  ["nginx",  "-g",  "daemon  off;"]
```

## Passo a Passo para deploy na AWS

Site onde está hospedado a aplicação:
> https://console.aws.amazon.com/console/home

Para manuseio e deploy deverá ser realizado via SSH:
```
To access your instance:

1.  Open an SSH client. (find out how to [connect using PuTTY](https://docs.aws.amazon.com/console/ec2/instances/connect/putty))
2.  Locate your private key file (producao-meufeirante.pem). The wizard automatically detects the key you used to launch the instance.
3.  Your key must not be publicly viewable for SSH to work. Use this command if needed:
    
    chmod 400 producao-meufeirante.pem
    
4.  Connect to your instance using its Public DNS:
    
    ec2-3-87-61-89.compute-1.amazonaws.com
    

Example:

ssh -i "producao-meufeirante.pem" ubuntu@ec2-3-87-61-89.compute-1.amazonaws.com

Please note that in most cases the username above will be correct, however please ensure that you read your AMI usage instructions to ensure that the AMI owner has not changed the default AMI username.
```

Após  o acesso a intância da AWS:

 ### Geração das chaves no Letsencripty 
  #### *** Deve ser executado apenas para criar a chave inicial  ou  nas atualizações das chaves***:
     !!! DEVE SER IGNORADO NOS DEPLOYS DA APLICAÇÃO !!!

 > Desativar o redirecionamento das portas (vide abaixo)
 > Rodar os comandos do script do letsencrytp ( ver no site [oficial](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx))

As chaves são geradas na pasta 
```
              /etc/letsencrypt/
```

Essa pasta deve ser copiada com as mesmas permissões para:

```
/home/ubuntu/meufeirante/meufeirante/nginx/letsencrypt
``` 

O Dockerfile irá copiar essa pasta para dentro do container.
```
	Ex: COPY  nginx/letsencrypt/  /etc/letsencrypt
```

Alterar o DONO da pasta e dos arquivos para o usuário UBUNTU

```
chown -Rf ubuntu:ubuntu letsencrypt
```



## Atualização do frontend

> cd meufeirante e escolher a pasta do frontend meufeirante

```
ubuntu@ip-172-31-90-166:~$ cd meufeirante/
ubuntu@ip-172-31-90-166:~/meufeirante$ ls
meufeirante  meufeirante-api
```

>  Na pasta meufeirante deverá atualizar o projeto:
```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ git pull
```

> Apagar a pasta build ( é criada automaticamente pelo react)
```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ rm -Rf build/
```
> Gerar o novo build do projeto 
```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ npm run build
```

Mesmo com o containner ligado, executar o comando abaixo para gerar o novo containner e atualizar a aplicação:

```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ docker-compose up -d --build
```

Resultado do processamento:

```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ docker-compose up -d --build
Building meufeirante-app
Step 1/6 : FROM nginx:stable-alpine
 ---> ab94f84cc474
Step 2/6 : COPY build /usr/share/nginx/html
 ---> a3b2e607b01d
Step 3/6 : COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
 ---> 8323cd800c41
Step 4/6 : COPY nginx/letsencrypt/ /etc/letsencrypt
 ---> 9cf8c25e0ddf
Step 5/6 : EXPOSE 80 443
 ---> Running in cc6ce1441634
Removing intermediate container cc6ce1441634
 ---> c60a74a9b850
Step 6/6 : CMD ["nginx", "-g", "daemon off;"]
 ---> Running in 52de9535267f
Removing intermediate container 52de9535267f
 ---> 4487e2c62a08

Successfully built 4487e2c62a08
Successfully tagged meufeirante_meufeirante-app:latest
Recreating meufeirante-app ... done

```

Para confirmação do sucesso da operação execute o docker ps -a e veirifique a CREATED do containner:

```
ubuntu@ip-172-31-90-166:~/meufeirante/meufeirante$ docker ps -a
CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS              PORTS                                       NAMES
eea2d6fc7b0c        meufeirante_meufeirante-app   "nginx -g 'daemon of…"   38 seconds ago      Up 37 seconds       0.0.0.0:88->80/tcp, 0.0.0.0:4443->443/tcp   meufeirante-app
eb01385e7b36        ifeira-api_ifeira-api         "docker-entrypoint.s…"   21 hours ago        Up 19 hours         0.0.0.0:3333->3000/tcp                      ifeira-api

```





# Redirect das portas 80  e 443
 
 O redirecionamento das portas acima para os containners foram realizados a partir dos seguintes comandos.
 ```
 sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 88
 sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 4443
 ```

Em caso de se precisar gerar um novo certificado no Letsencrypt,
o redirecionamento deve ser desfeito, e após gerar o certificado, refeito novamente.

Para desfazer:

```
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 80
 sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 443
```



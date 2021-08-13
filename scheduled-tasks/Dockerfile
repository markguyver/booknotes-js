FROM ubuntu:20.04

RUN apt install -y cron mysql-client && \
    service cron start
COPY scripts /var/scripts
COPY crontab.txt /root
RUN crontab -e < /root/crontab.txt

VOLUME /var/exports
ENV EXPORT_DIRECTORY "/var/export"
CMD ["tail", "-f", "/dev/null"]
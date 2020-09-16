import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../../entities/message.entity';
import { Station } from '../../entities/station.entity';

@Injectable()
export class AdminGeoJsonService {
  constructor(
    @InjectRepository(Message, 'default') private readonly messageRepository: Repository<Message>,
    @InjectRepository(Station, 'default') private readonly stationRepository: Repository<Station>,
  ) { }

  async getFrequencies(): Promise<Object> {
    console.log('blah');
    const stations: any = await this.getStations();
    console.log(stations);
    const features = await Promise.all(stations.map(async (station: Station) => {
      console.log(station);
      const messages: any = await this.messageRepository.createQueryBuilder('message')
        .select('frequency', 'frequency')
        .addSelect('count(*)', 'message_count')
        .where(`station_id = ${station.id}`)
        .groupBy('frequency')
        .orderBy('message_count', 'DESC')
        .getRawMany();

      console.log(messages);
      var min = 0.0200,
          max = 0.50,
          randNumber = Math.random() * (max - min) + min;
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [(Number(station.longitude) + randNumber).toFixed(2), (Number(station.latitude) + randNumber).toFixed(2)]
        },
        properties: {
          name: station.ident,
          tooltip: messages.map((message: any) => `${message.frequency.toFixed(3)} has had ${message.message_count} messages`).join('\n')
        }
      };
      // features.push(point);
      console.log(point);
      return point;
    }));
    return { type: 'FeatureCollection', features: features };
  }

  async getStations(): Promise<Object> {
    const stations: Array<Station> = await this.stationRepository.createQueryBuilder('stations')
      .orderBy('ident', 'ASC')
      .where('stations.latitude IS NOT NULL')
      .getMany();
    return stations;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Airframe } from '../../entities/airframe.entity';
import { Flight } from '../../entities/flight.entity';
import { Message } from '../../entities/message.entity';
import { Station } from '../../entities/station.entity';
import { StationMessageCount } from '../../entities/station_message_count.entity';
import { ReportMonthlyCount } from 'src/entities/report_monthly_count.entity';
import { ReportDailyCount } from 'src/entities/report_daily_count.entity';
import { ReportHourlyCount } from 'src/entities/report_hourly_count.entity';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectRepository(Airframe, 'readonly') private readonly airframeRepository: Repository<Airframe>,
    @InjectRepository(Flight, 'readonly') private readonly flightRepository: Repository<Flight>,
    @InjectRepository(Message, 'readonly') private readonly messageRepository: Repository<Message>,
    @InjectRepository(ReportMonthlyCount, 'readonly') private readonly reportMonthlyCountRepository: Repository<ReportMonthlyCount>,
    @InjectRepository(ReportDailyCount, 'readonly') private readonly reportDailyCountRepository: Repository<ReportDailyCount>,
    @InjectRepository(ReportHourlyCount, 'readonly') private readonly reportHourlyCountRepository: Repository<ReportHourlyCount>,
    @InjectRepository(Station, 'readonly') private readonly stationRepository: Repository<Station>,
    @InjectRepository(StationMessageCount, 'readonly') private readonly stationMessageCountRepository: Repository<Station>,
  ) { }

  async getAirframeCount(): Promise<Object> {
    return await this.airframeRepository
      .createQueryBuilder('airframes')
      .leftJoin('airframes.flights', 'flights')
      .leftJoin('airframes.messages', 'messages')
      // .leftJoin('airframes.stations', 'stations')
      .select('airframes.tail', 'tail')
      .addSelect('COUNT(DISTINCT(flights.id)) as flight_count')
      .addSelect('COUNT(DISTINCT(messages.id)) as message_count')
      // .addSelect('COUNT(DISTINCT(stations.id)) as station_count')
      .groupBy('airframes.tail')
      .getRawMany();
  }

  async getMessageErrorStats(): Promise<Object> {
    return await this.messageRepository.createQueryBuilder('messages')
      .groupBy('error')
      .select('error, count(error)')
      .getRawMany();
  }

  async getMessageLabelStats(): Promise<Object> {
    return await this.messageRepository.createQueryBuilder('messages')
      .groupBy('label')
      .select('label, count(label)')
      .getRawMany();
  }

  async getFlightCount(): Promise<Object> {
    return await this.flightRepository.createQueryBuilder('flights')
      .groupBy('flight')
      .select('flight, COUNT(flight)')
      .getRawMany();
  }

  async getReportMonthlyCounts(id): Promise<Object> {
    return await this.reportMonthlyCountRepository.createQueryBuilder('report_monthly_counts')
      .where({
        stationId: id
      })
      .getMany();
  }

  async getReportDailyCounts(id): Promise<Object> {
    return await this.reportDailyCountRepository.createQueryBuilder('report_daily_counts')
      .where({
        stationId: id
      })
      .getMany();
  }

  async getReportHourlyCounts(id): Promise<Object> {
    return await this.reportHourlyCountRepository.createQueryBuilder('report_hourly_counts')
      .where({
        stationId: id
      })
      .getMany();
  }

  async getStationMessageCount(id): Promise<Object> {
    return await this.stationMessageCountRepository.createQueryBuilder('station_message_counts')
      .where({
        stationId: id
      })
      .getOne();
  }

  async getStats(): Promise<Object> {
    let airframeCount = await this.getAirframeCount();
    let errorStats = await this.getMessageErrorStats();
    let labelStats = await this.getMessageLabelStats();
    let flightCount = await this.getFlightCount();

    return {
      airlines: [],
      airframes: airframeCount,
      errors: errorStats,
      flights: flightCount,
      frequencies: [],
      labels: labelStats,
      stations: [],
    };
  }

  async getAirlines(): Promise<Object> {
    let airlines = [];

    return {
      airlines: airlines
    };
  }

  async getAirframes(): Promise<Object> {
    let airframeCount = await this.getAirframeCount();

    return {
      airframes: airframeCount
    };
  }

  async getErrors(): Promise<Object> {
    let errorStats = await this.getMessageErrorStats();

    return {
      errors: errorStats
    };
  }

  async getFlights(): Promise<Object> {
    let flightCount = await this.getFlightCount();

    return {
      flights: flightCount
    };
  }

  async getFrequencies(): Promise<Object> {
    return {
      frequencies: []
    };
  }

  async getLabels(): Promise<Object> {
    let labelStats = await this.getMessageLabelStats();

    return {
      labels: labelStats
    };
  }

  async getStations(): Promise<Object> {
    const stations: any = await this.stationRepository.createQueryBuilder('stations')
      .getMany();
    const stationCounts = await stations.reduce(async(acc, station: any) => {
      const accumulator = await acc;
      accumulator[station.id] = await this.getStationCounts(station);
      return accumulator;
    }, {})

    return {
      stations: stationCounts,
    };
  }

  async getStationCounts(station): Promise<Object> {
    const reportMonthlyCounts: any = await this.getReportMonthlyCounts(station.id);
    const reportDailyCounts: any = await this.getReportDailyCounts(station.id);
    const reportHourlyCounts: any = await this.getReportHourlyCounts(station.id);
    const stationMessageCount: any = await this.getStationMessageCount(station.id);

    const monthly = reportMonthlyCounts.reduce((map, rmc: any) => {
      const date: Date = rmc.date;
      map[`${date.getFullYear()}-${(date.getUTCMonth() + 101).toString().substring(1)}`] = rmc.messagesCount;
      return map;
    }, {});

    const daily = reportDailyCounts.reduce((map, rmc: any) => {
      const date: Date = rmc.date;
      console.log(rmc.date);
      // map[date.toString()] = rmc.messagesCount;
      map[`${date.getFullYear()}-${(date.getUTCMonth() + 101).toString().substring(1)}-${(date.getUTCDay() + 101).toString().substring(1)}`] = rmc.messagesCount;
      return map;
    }, {});

    return {
      ident: station.ident,
      messages: {
        all: Number(stationMessageCount.messagesCount),
        monthly: monthly,
        daily: daily,
      }
    }
  }
}

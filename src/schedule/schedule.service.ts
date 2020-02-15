import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';

import { EventsGateway } from '../events/events.gateway';
import { Flight } from '../entities/flight.entity';
import { Leaderboard } from '../entities/leaderboard.entity';
import { LeaderboardRank } from '../entities/leaderboard_rank.entity';
import { Message } from '../entities/message.entity';
import { Station } from '../entities/station.entity';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {
  constructor(
    @Inject("EventsGateway") private readonly eventsGateway: EventsGateway,
    @InjectRepository(Leaderboard) private readonly leaderboardRepository: Repository<Leaderboard>,
    @InjectRepository(LeaderboardRank) private readonly leaderboardRankRepository: Repository<LeaderboardRank>,
    @InjectRepository(Flight) private readonly flightRepository: Repository<Station>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Station) private readonly stationRepository: Repository<Station>,
  ) {
    super()
  }

  private readonly logger = new Logger(ScheduleService.name);

  // @Cron('0 0 2 * *', {
  //   startTime: new Date(),
  //   endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  // })
  // async cronJob() {
  //   console.log('executing cron job');
  // }

  // @Timeout(5000)
  // onceJob() {
  //   console.log('executing once job');
  // }

  // @Cron('0 0 0 2 * *', {
  //   startTime: new Date(),
  //   endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  // })
  @Cron('0 25 * * * *')
  async calculateLeaderboard() {
    this.logger.log('Cron Job: Calculating Leaderboard');

    let leaderboard = await this.leaderboardRepository.findOne({
      relations: ['ranks'],
      where: {
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });
    this.logger.log(leaderboard);
    if (!leaderboard) {
      leaderboard = new Leaderboard();
      leaderboard.date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      await this.leaderboardRepository.save(leaderboard);
    }

    // Gather stations
    let stations = await this.stationRepository.find({
      relations: ['stationMessageCount']
    });

    // Gather airframe counts
    let airframeAllTimeCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT airframe_id)', 'airframe_count')
      .where("station_id IS NOT NULL")
      .groupBy('station_id')
      .orderBy('airframe_count', 'DESC')
      .getRawMany();
    let airframeThisMonthCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT airframe_id)', 'airframe_count')
      .where("station_id IS NOT NULL AND created_at >= DATE_TRUNC('month', NOW())")
      .groupBy('station_id')
      .orderBy('airframe_count', 'DESC')
      .getRawMany();
    let airframeLast24HoursCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT airframe_id)', 'airframe_count')
      .where("station_id IS NOT NULL AND created_at >= NOW() - INTERVAL '1 day'")
      .groupBy('station_id')
      .orderBy('airframe_count', 'DESC')
      .getRawMany();

    // Gather flight counts
    let flightAllTimeCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT flight_id)', 'flight_count')
      .where("station_id IS NOT NULL")
      .groupBy('station_id')
      .orderBy('flight_count', 'DESC')
      .getRawMany();
    let flightThisMonthCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT flight_id)', 'flight_count')
      .where("station_id IS NOT NULL AND created_at >= DATE_TRUNC('month', NOW())")
      .groupBy('station_id')
      .orderBy('flight_count', 'DESC')
      .getRawMany();
    let flightLast24HoursCounts = await this.messageRepository.createQueryBuilder("message")
      .select('station_id', 'station_id')
      .addSelect('COUNT(DISTINCT flight_id)', 'flight_count')
      .where("station_id IS NOT NULL AND created_at >= NOW() - INTERVAL '1 day'")
      .groupBy('station_id')
      .orderBy('flight_count', 'DESC')
      .getRawMany();

    // Gather ground station counts
    // Gather message counts

    let stationStats = [];
    stations.forEach((station) => {
      let stationStat = {};
      stationStat['station'] = station;
      if (station.stationMessageCount) {
        stationStat['messageAllTimeCount'] = station.stationMessageCount.messagesCount;
      } else {
        stationStat['messageAllTimeCount'] = 0;
      }

      let airframeAllTimeCount = airframeAllTimeCounts.find((count) => count.station_id == station.id);
      if (airframeAllTimeCount) {
        stationStat['airframeAllTimeCount'] = Number(airframeAllTimeCount.airframe_count);
      } else {
        stationStat['airframeAllTimeCount'] = 0;
      }

      let airframeThisMonthCount = airframeThisMonthCounts.find((count) => count.station_id == station.id);
      if (airframeThisMonthCount) {
        stationStat['airframeThisMonthCount'] = Number(airframeThisMonthCount.airframe_count);
      } else {
        stationStat['airframeThisMonthCount'] = 0;
      }

      let airframeLast24HoursCount = airframeLast24HoursCounts.find((count) => count.station_id == station.id);
      if (airframeLast24HoursCount) {
        stationStat['airframeLast24HoursCount'] = Number(airframeLast24HoursCount.airframe_count);
      } else {
        stationStat['airframeLast24HoursCount'] = 0;
      }

      let flightAllTimeCount = flightAllTimeCounts.find((count) => count.station_id == station.id);
      if (flightAllTimeCount) {
        stationStat['flightAllTimeCount'] = Number(flightAllTimeCount.flight_count);
      } else {
        stationStat['flightAllTimeCount'] = 0;
      }

      let flightThisMonthCount = flightThisMonthCounts.find((count) => count.station_id == station.id);
      if (flightThisMonthCount) {
        stationStat['flightThisMonthCount'] = Number(flightThisMonthCount.flight_count);
      } else {
        stationStat['flightThisMonthCount'] = 0;
      }

      let flightLast24HoursCount = flightLast24HoursCounts.find((count) => count.station_id == station.id);
      if (flightLast24HoursCount) {
        stationStat['flightLast24HoursCount'] = Number(flightLast24HoursCount.flight_count);
      } else {
        stationStat['flightLast24HoursCount'] = 0;
      }

      stationStat['points'] = (
        (stationStat['messageAllTimeCount'] * 1) +
        (stationStat['airframeAllTimeCount'] * 2) +
        (stationStat['airframeThisMonthCount'] * 10) +
        (stationStat['airframeLast24HoursCount'] * 50) +
        (stationStat['flightAllTimeCount'] * 2) +
        (stationStat['flightThisMonthCount'] * 10) +
        (stationStat['flightLast24HoursCount'] * 50)
      );
      stationStats.push(stationStat);
    });
    stationStats.sort((a, b) => (a.points > b.points) ? 1 : -1).reverse();
    stationStats = stationStats.map((station, index) => {
      station.rank = index + 1;
      return station;
    });

    await this.leaderboardRankRepository.createQueryBuilder()
      .delete()
      .from(LeaderboardRank)
      .where("leaderboard_id = :id", { id: leaderboard.id })
      .execute();

    stationStats.forEach(async (stationStat) => {
      console.log(stationStat);
      if (stationStat.station && stationStat.station.id) {
        let rank = new LeaderboardRank();
        rank.leaderboard = leaderboard;
        rank.station = stationStat.station;
        rank.ranking = stationStat.rank;
        rank.points = stationStat.points;
        rank.airframeAllTimeCount = stationStat.airframeAllTimeCount;
        rank.airframeThisMonthCount = stationStat.airframeThisMonthCount;
        rank.airframeLast24HoursCount = stationStat.airframeLast24HoursCount;
        rank.flightAllTimeCount = stationStat.flightAllTimeCount;
        rank.flightThisMonthCount = stationStat.flightThisMonthCount;
        rank.flightLast24HoursCount = stationStat.flightLast24HoursCount;
        rank.messageAllTimeCount = stationStat.messageAllTimeCount;
        await this.leaderboardRankRepository.save(rank);
      }
    });
  }

  @Interval(5000)
  async intervalJob() {
    this.logger.log('Job running to gather and broadcast updated data.');
    // this.eventsGateway.broadcast('events', 'interval-job');

    let stations = await this.stationRepository.find({
      relations: ['stationMessageCount']
    });
    this.logger.log('Preparing to broadcast ' + stations.length + ' stations.');
    this.eventsGateway.broadcast('stations', stations);

    // Update inactive flights
    await this.flightRepository
      .createQueryBuilder()
      .update(Flight)
      .set({ status: 'radio-silence' })
      .where("status = :status AND updated_at <= (timezone('utc', now()) - interval '5 minutes')", { status: 'in-flight' })
      .execute();

    let activeFlights = await this.flightRepository.find({
      relations: ['airframe'],
      where: { status: 'in-flight' }
    });
    this.logger.log('Preparing to broadcast ' + activeFlights.length + ' active flights.');
    this.eventsGateway.broadcast('activeFlights', activeFlights);

    // if you want to cancel the job, you should return true;
    // return true;
  }

}

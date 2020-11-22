import { IJobConfig } from 'nest-schedule'

export const TimeoutTaskDefaults: IJobConfig = { maxRetry: 24, retryInterval: 2.5 * 1000 }
export const IntervalTaskDefaults: IJobConfig = { immediate: true, ...TimeoutTaskDefaults }
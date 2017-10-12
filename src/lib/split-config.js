import { Client } from 'seven-ten';
import apiClient from 'panoptes-client/lib/api-client';
import { env } from '../config';

if (env === 'production') {
  Client.config = {
    host: 'https://seven-ten.zooniverse.org',
    headers: apiClient.headers
  };
} else {
  Client.config = {
    host: 'https://seven-ten-staging.zooniverse.org',
    headers: apiClient.headers
  };
}

export default Client.config;

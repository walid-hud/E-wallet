//@ts-check
import { randomUUID } from "node:crypto";
import {  ServerResponse } from "node:http";

export function gen_id() {
  return randomUUID().slice(0, 8); // keep ids short for demo
}
export const toJson = (obj ={}) => JSON.stringify(obj);

/**
 * @param {ServerResponse} res
 * @param {number} status
 * @param {object} payload
 */
export const respond = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(toJson(payload));
};


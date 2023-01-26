// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

import { fetchTable } from "../../../lib/driver";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  try {
    const categories = await fetchTable("categories");
    res.status(200).json({ categories: Object.values(categories) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

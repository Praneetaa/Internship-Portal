// Roundtrip check for MongoDB-backed uploads. No DB needed: the File model's
// create/findById are stubbed, so this only tests the controller logic.
import assert from "node:assert/strict";
import test from "node:test";
import File from "../models/File.js";
import { uploadFile, getFile } from "../controllers/fileController.js";

const req = (over) => ({
   protocol: "http",
   get: () => "localhost:5000",
   params: {},
   ...over,
});

const res = () => {
   const r = {
      code: 200,
      body: null,
      headers: {},
      status(c) {
         r.code = c;
         return r;
      },
      json(b) {
         r.body = b;
         return r;
      },
      send(b) {
         r.body = b;
         return r;
      },
      set(k, v) {
         r.headers[k] = v;
         return r;
      },
   };
   return r;
};

const id = "65a000000000000000000001";
const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

test("upload stores bytes and returns a file URL", async () => {
   let saved;
   File.create = async (doc) => {
      saved = doc;
      return { _id: id };
   };
   const r = res();
   await uploadFile(
      req({
         file: {
            buffer: bytes,
            mimetype: "image/png",
            originalname: "a.png",
         },
      }),
      r,
   );
   assert.equal(r.code, 200);
   assert.equal(r.body.imageUrl, `http://localhost:5000/api/files/${id}`);
   assert.deepEqual(saved.data, bytes);
   assert.equal(saved.contentType, "image/png");
});

test("upload without a file is a 400", async () => {
   const r = res();
   await uploadFile(req({}), r);
   assert.equal(r.code, 400);
});

test("get returns the same bytes with the stored content type", async () => {
   File.findById = async () => ({ data: bytes, contentType: "image/png" });
   const r = res();
   await getFile(req({ params: { id } }), r);
   assert.equal(r.headers["Content-Type"], "image/png");
   assert.deepEqual(r.body, bytes);
});

test("a bad id is a 400, a missing file is a 404", async () => {
   const bad = res();
   await getFile(req({ params: { id: "nope" } }), bad);
   assert.equal(bad.code, 400);

   File.findById = async () => null;
   const missing = res();
   await getFile(req({ params: { id } }), missing);
   assert.equal(missing.code, 404);
});

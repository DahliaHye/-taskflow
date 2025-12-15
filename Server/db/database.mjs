import { config } from "../config.mjs";
import Mongoose from "mongoose";

export async function connectDB() {
  const dbHost = config.db.host;
  const dbName = "aidetect";
  
  // MongoDB Atlas 연결 문자열에 데이터베이스 이름 추가
  let connectionString = dbHost;
  
  // 연결 문자열에 데이터베이스 이름이 없으면 추가
  if (dbHost.includes('/?')) {
    // /? 앞에 데이터베이스 이름 추가
    connectionString = dbHost.replace('/?', `/${dbName}?`);
  } else if (!dbHost.match(/\/[^\/\?]+(\?|$)/) && !dbHost.endsWith('/')) {
    // 데이터베이스 이름이 없고 /로 끝나지 않으면 추가
    connectionString = `${dbHost}/${dbName}`;
  } else if (dbHost.endsWith('/')) {
    // /로 끝나면 데이터베이스 이름 추가
    connectionString = `${dbHost}${dbName}`;
  }
  
  console.log(`🔗 Connecting to MongoDB: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  
  return Mongoose.connect(connectionString);
}

// 스키마에 기능을 추가
// _id 값을 문자열로 변환한 id라는 가상 필드 생성
// JSON 또는 객체 변환 시(응답 보낼 때) virtual 필드도 포함하도록 설정
export function useVirtualId(schema) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtual: true });
  schema.set("toObject", { virtual: true });
}

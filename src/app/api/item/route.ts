"use server";

import { NextRequest, NextResponse } from "next/server";

import {
  type Item,
  type ItemSearchOption,
  initItemSearchOption,
} from "@/types";
import { type PostRequest, PostRequestType } from "@/types/api.request";
import {
  type ListResult,
  makeNoneResult,
  makeErrorResult,
  makeSingleResult,
  makeListResult,
} from "@/types/api.result";
import {
  statusCodeOK,
  statusCodeOKCreated,
  statusCodeOKNoContent,
  statusCodeOKResetContent,
  statusCodeNotFound,
  statusCodeBadRequest,
  statusCodeInternalServerError,
} from "@/types/api.status";

import {
  getItem,
  listItems,
  createItem,
  updateItem,
  deleteItems,
} from "@/services/item.service";

// TODO : itemURI 변경
const itemURI = "/items/";

function makeSearchOption(searchParams: URLSearchParams): ItemSearchOption {
  const opt = initItemSearchOption();
  // TODO 검색은 나중에 구현
  // const name = searchParams.get("name");
  // if (name && name !== "") {
  //   opt.name;
  // }
  opt.page = parseInt(searchParams.get("page") || "1", 10);
  opt.unit = parseInt(searchParams.get("unit") || "10", 10);
  return opt;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      // 단일 조회 구분
      const item = await getItem(parseInt(id, 10));
      if (item) {
        return NextResponse.json(makeSingleResult(item), statusCodeOK());
      }
      return NextResponse.json(makeSingleResult(null), statusCodeNotFound());
    }

    // 목록 조회 구분
    const { list, totalCount }: ListResult<Item> = await listItems(
      makeSearchOption(searchParams),
    );
    if (list.length > 0) {
      return NextResponse.json(
        makeListResult(list, totalCount),
        statusCodeOK(),
      );
    }
    return NextResponse.json(
      makeListResult([], 0, "조회된 데이터가 없습니다"),
      statusCodeNotFound(),
    );
  } catch (e: any) {
    // 에러 발생
    return NextResponse.json(
      makeErrorResult(e.message),
      statusCodeInternalServerError(),
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = (await request.json()) as PostRequest;
    if (req.requestType === PostRequestType.POST_REQUEST_CREATE) {
      // 생성 요청
      const res = await createItem(req.data as Item);
      if (req.returnData) {
        // 생성 이후 클라이언트가 데이터 반환을 요청한다면
        return NextResponse.json(
          makeSingleResult(res, "데이터가 생성되었습니다"),
          statusCodeOKCreated(),
        );
      }
      // 생성에 성공했으나 클라이언트가 데이터 반환을 요청하지 않는다면 그냥 uri 만 리턴
      const uri = itemURI + res.id;
      return NextResponse.json(
        makeNoneResult("데이터가 생성되었습니다"),
        statusCodeOKCreated(uri),
      );
    } else if (req.requestType === PostRequestType.POST_REQUEST_UPDATE) {
      // 수정 요청
      const res = await updateItem(req.data as Item);
      if (req.returnData) {
        // 수정 이후 클라이언트가 데이터 반환을 요청한다면
        return NextResponse.json(
          makeSingleResult(res, "데이터가 수정되었습니다"),
          statusCodeOKResetContent(),
        );
      }
      // 수정에 성공했으나 클라이언트가 데이터 반환을 요청하지 않는다면 그냥 uri 만 리턴
      const uri = itemURI + res.id;
      return NextResponse.json(
        makeSingleResult(res, "데이터가 수정되었습니다"),
        statusCodeOKResetContent(uri),
      );
    } else if (req.requestType === PostRequestType.POST_REQUEST_DELETE) {
      // 삭제 요청
      await deleteItems(req.data as number[]);
      return NextResponse.json(
        makeNoneResult("데이터가 삭제되었습니다"),
        statusCodeOKNoContent(),
      );
    } else {
      // 잘못된 요청 타입
      return NextResponse.json(
        makeErrorResult("잘못된 요청입니다"),
        statusCodeBadRequest(),
      );
    }
  } catch (e: any) {
    // 에러 발생
    return NextResponse.json(
      makeErrorResult(e.message),
      statusCodeInternalServerError(),
    );
  }
}

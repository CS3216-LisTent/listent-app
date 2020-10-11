import axios from "axios";
import { useSWRInfinite } from "swr";

export const PAGE_SIZE = 6;

export default function useInfinite(apiPath) {
  const { data, size, setSize, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) {
        return null;
      }
      return `${apiPath}?skip=${pageIndex * PAGE_SIZE}&limit=${PAGE_SIZE}`;
    },
    (url) => axios.get(url).then((res) => res.data.data)
  );

  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined";
  const isEmpty = data[0].length === 0;
  const isReachingEnd = isEmpty || data[data.length - 1].length < PAGE_SIZE;

  return { data, size, setSize, isLoadingMore, isEmpty, isReachingEnd, mutate };
}
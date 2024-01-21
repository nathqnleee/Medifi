import {
  Mappedin,
  OfflineSearch,
  TMappedinOfflineSearchResult
} from "@mappedin/mappedin-js";
import { useDeferredValue, useEffect, useState } from "react";

/**
 * Declarative OfflineSearch API that returns a deferred value
 */
export default function useOfflineSearch(
  venue: Mappedin | undefined,
  query: string
) {
  // Store the OfflineSearch instance in a state variable
  const [searchInstance, setSearchInstance] = useState<
    OfflineSearch | undefined
  >();
  // Store the most recent results
  const [results, setResults] = useState<TMappedinOfflineSearchResult[]>([]);
  // Defer the new search query until state updates are complete
  const deferredQuery = useDeferredValue(query);

  // Create the OfflineSearch instance
  useEffect(() => {
    if (venue == null) {
      setSearchInstance(undefined);
      return;
    }

    const instance = new OfflineSearch(venue);
    setSearchInstance(instance);
  }, [venue]);

  // Get search results asynchronously
  useEffect(() => {
    if (venue == null || searchInstance == null || deferredQuery === "") {
      setResults([]);
      return;
    }

    const generateSearchResults = async () => {
      const results = await searchInstance.search(deferredQuery);
      setResults(results);
    };
    generateSearchResults();
  }, [deferredQuery, venue, searchInstance]);

  // Return the most recent results
  return results;
}

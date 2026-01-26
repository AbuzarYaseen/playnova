"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function LoadMore({
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: LoadMoreProps) {
  if (isLoading) return null;

  if (!hasNextPage) {
    return (
      <div className="flex justify-center py-8 text-muted-foreground">
        <p>You have reached the end of the list.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <Button
        variant="outline"
        size="lg"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
        className="min-w-[200px]"
      >
        {isFetchingNextPage ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </Button>
    </div>
  );
}

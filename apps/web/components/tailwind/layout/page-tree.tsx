"use client";

import { useAtomValue } from "jotai";
import type { Page } from "@/lib/types";
import { pagesAtom } from "@/lib/atoms";
import { PageItem } from "./page-item";

interface PageTreeProps {
  onPropertiesClick?: () => void;
}

export function PageTree({ onPropertiesClick }: PageTreeProps) {
  const pages = useAtomValue(pagesAtom);

  if (pages.length === 0) {
    return null;
  }

  return (
    <div>
      {pages.map((page) => (
        <PageItem
          key={page.id}
          page={page}
          onPropertiesClick={onPropertiesClick}
        />
      ))}
    </div>
  );
}


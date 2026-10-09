/** Pagination gallery specimens: one variant per tile. docs/specs/pagination.md. */
import { Pagination } from "@area/react";

/* Ten pages, the fifth current: both ellipses show. */
export const GalleryPagination = () => <Pagination pageCount={10} defaultPage={5} />;
export const GalleryPaginationCompact = () => <Pagination layout="compact" pageCount={10} defaultPage={2} />;
export const GalleryPaginationIconSteps = () => <Pagination pageCount={10} defaultPage={5} stepLabels={false} />;
export const GalleryPaginationSm = () => <Pagination size="sm" pageCount={10} defaultPage={5} stepLabels={false} />;
export const GalleryPaginationMd = () => <Pagination size="md" pageCount={10} defaultPage={5} stepLabels={false} />;
export const GalleryPaginationLg = () => <Pagination size="lg" pageCount={10} defaultPage={5} stepLabels={false} />;
/* Seven pages or fewer show every number. */
export const GalleryPaginationFew = () => <Pagination pageCount={5} defaultPage={3} />;
/* Long result sets: four-digit pages widen their square. */
export const GalleryPaginationMany = () => <Pagination pageCount={1250} defaultPage={1180} stepLabels={false} />;
/* On the first page Previous stays focusable but unavailable. */
export const GalleryPaginationFirst = () => <Pagination pageCount={10} defaultPage={1} />;
/* Every item a link, so a page opens in a new tab like any other link. */
export const GalleryPaginationLinks = () => <Pagination pageCount={10} defaultPage={5} getHref={page => `#gallery-pagination-page-${page}`} />;

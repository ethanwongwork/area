/** Page header gallery specimens: one variant per tile, one size per tile. docs/specs/page-header.md. */
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, Button, PageHeader, Tabs } from "@area/react";

/* A page's column: the header heads a page, so the tile is a page's width. */
const page = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryPageHeader = () => (
  <PageHeader style={page} title="Title" description="Description"
    actions={<><Button variant="outline">Secondary</Button><Button variant="solid">Action</Button></>} />
);
export const GalleryPageHeaderSm = () => <PageHeader style={page} size="sm" title="Title" description="Description" />;
export const GalleryPageHeaderMd = () => <PageHeader style={page} size="md" title="Title" description="Description" />;
export const GalleryPageHeaderLg = () => <PageHeader style={page} size="lg" title="Title" description="Description" />;
/* The way back: the page's parents as a Breadcrumb, over the title. */
export const GalleryPageHeaderParent = () => (
  <PageHeader style={page} title="Title" description="Description"
    parent={<Breadcrumb><BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#gallery-page-header-parent">Item one</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#gallery-page-header-parent">Item two</BreadcrumbLink></BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>} />
);
/* The page's views under the title and its description. */
export const GalleryPageHeaderNavigation = () => (
  <PageHeader style={page} title="Title" description="Description"
    actions={<Button variant="solid">Action</Button>}
    navigation={<Tabs aria-label="Views" defaultValue="one" items={[{ value: "one", label: "Item one" }, { value: "two", label: "Item two" }, { value: "three", label: "Item three" }]} />} />
);
export const GalleryPageHeaderTitleOnly = () => <PageHeader style={page} title="Title" />;

import { assetForRole } from "@/brand/data/image-curation";
import { PortfolioView } from "@/brand/views/portfolio-view";
import { JsonLd } from "@/components/ui";
import { composeRows, getArchiveAssets, pickArchive } from "@/lib/media/query-readonly";
import { collectionPageSchema, generateSEO } from "@/lib/seo";

const DESCRIPTION =
  "Three illustrative event concepts showing the scale Nexyyra Events plans, and an archive of real photography from our productions and venue walkthroughs.";

export const metadata = generateSEO({
  title: "Portfolio: Concepts and the Archive",
  description: DESCRIPTION,
  path: "/portfolio",
});

export default async function PortfolioPage() {
  // The cover and the three concept frames are already on this page; the archive never repeats them.
  const shown = ["cover-portfolio", "concept-cs-1", "concept-cs-2", "concept-cs-3"]
    .map((role) => assetForRole(role)?.id)
    .filter((id): id is string => Boolean(id));
  const archive = await getArchiveAssets(shown);
  // A fixed mix so every in-page filter tab has photographs; the full archive lives on /gallery.
  const picks = composeRows(pickArchive(archive, { weddings: 12, venues: 8, other: 4 }));

  return (
    <>
      <JsonLd data={collectionPageSchema({ name: "Portfolio: concepts and the archive", description: DESCRIPTION, path: "/portfolio" })} />
      <PortfolioView archive={picks} />
    </>
  );
}

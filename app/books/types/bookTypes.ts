export interface Work {
  // Core fields
  key: string;
  title: string;
  title_sort: string;
  title_suggest: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  edition_count: number;
  cover_i?: number;
  cover_edition_key?: string;
  type: string;

  // Ratings and popularity
  ratings_average?: number;
  ratings_sortable?: number;
  ratings_count?: number;
  ratings_count_1?: number;
  ratings_count_2?: number;
  ratings_count_3?: number;
  ratings_count_4?: number;
  ratings_count_5?: number;
  readinglog_count?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;

  // Publication details
  publish_year?: number[];
  publish_date?: string[];
  publisher?: string[];
  publish_place?: string[];
  first_sentence?: string[];
  format?: string[];
  language?: string[];
  isbn?: string[];
  number_of_pages_median?: number;

  // Authors and contributors
  author_alternative_name?: string[];
  contributor?: string[];

  // Classifications
  ddc?: string[];
  lcc?: string[];
  lccn?: string[];
  oclc?: string[];
  subject?: string[];
  subject_key?: string[];
  subject_facet?: string[];
  place?: string[];
  place_key?: string[];
  place_facet?: string[];
  person?: string[];
  person_key?: string[];
  person_facet?: string[];

  // Ebook and digital access
  ebook_access?: string;
  ebook_count_i?: number;
  ebook_provider?: string[];
  has_fulltext: boolean;
  public_scan_b: boolean;
  lending_edition_s?: string;
  lending_identifier_s?: string;
  printdisabled_s?: string;

  // Internet Archive
  ia?: string[];
  ia_collection?: string[];
  ia_collection_s?: string;
  ia_loaded_id?: string[];
  ia_box_id?: string[];
  osp_count?: number;

  // External IDs
  id_amazon?: string[];
  id_goodreads?: string[];
  id_alibris_id?: string[];
  id_google?: string[];
  id_amazon_ca_asin?: string[];
  id_paperback_swap?: string[];
  id_librarything?: string[];
  id_amazon_co_uk_asin?: string[];
  id_amazon_de_asin?: string[];
  id_amazon_it_asin?: string[];
  id_depósito_legal?: string[];
  id_british_national_bibliography?: string[];
  id_scribd?: string[];

  // Facets
  author_facet?: string[];
  publisher_facet?: string[];

  // Metadata
  last_modified_i: number;
  seed?: string[];
  edition_key?: string[];

  // Editions (embedded)
  editions?: {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: EditionOfWork[];
  };

  // Sorting fields
  ddc_sort?: string;
  lcc_sort?: string;

  // Trending scores (grouped as less commonly used)
  trending_score_hourly_0?: number;
  trending_score_hourly_1?: number;
  trending_score_hourly_2?: number;
  trending_score_hourly_3?: number;
  trending_score_hourly_4?: number;
  trending_score_hourly_5?: number;
  trending_score_hourly_6?: number;
  trending_score_hourly_7?: number;
  trending_score_hourly_8?: number;
  trending_score_hourly_9?: number;
  trending_score_hourly_10?: number;
  trending_score_hourly_11?: number;
  trending_score_hourly_12?: number;
  trending_score_hourly_13?: number;
  trending_score_hourly_14?: number;
  trending_score_hourly_15?: number;
  trending_score_hourly_16?: number;
  trending_score_hourly_17?: number;
  trending_score_hourly_18?: number;
  trending_score_hourly_19?: number;
  trending_score_hourly_20?: number;
  trending_score_hourly_21?: number;
  trending_score_hourly_22?: number;
  trending_score_hourly_23?: number;
  trending_score_hourly_sum?: number;
  trending_score_daily_0?: number;
  trending_score_daily_1?: number;
  trending_score_daily_2?: number;
  trending_score_daily_3?: number;
  trending_score_daily_4?: number;
  trending_score_daily_5?: number;
  trending_score_daily_6?: number;
  trending_z_score?: number;

  // Version (internal)
  _version_?: number;
}

export interface EditionOfWork {
  // Core fields
  key: string;
  type: string;
  title: string;
  title_sort: string;
  title_suggest: string;
  cover_i?: number;

  // Authors
  author_name?: string[];
  author_key?: string[];
  author_alternative_name?: string[];
  author_facet?: string[];

  // Publication details
  publisher?: string[];
  publish_date?: string[];
  publish_year?: number[];
  language?: string[];
  format?: string[];
  isbn?: string[];

  // Digital access
  ebook_access?: string;
  ebook_provider?: string[];
  has_fulltext: boolean;
  public_scan_b: boolean;

  // Internet Archive
  ia?: string[];
  ia_collection?: string[];
  ia_box_id?: string[];

  // External IDs
  id_google?: string[];
  id_librarything?: string[];
  id_goodreads?: string[];

  // Facets
  publisher_facet?: string[];

  // Internal
  _version_?: number;
}

export interface Edition {
  // Core identifiers (always present)
  key: string;
  type: { key: string };

  // Essential metadata (title and links)
  title: string;
  authors?: Array<{ key: string }>;
  works?: Array<{ key: string }>;

  // Publication basics (shared across contexts)
  publishers?: string[];
  publish_date?: string;
  source_records?: string[];

  // ISBNs (may vary by edition)
  isbn_10?: string[];  // Unique to detailed edition
  isbn_13?: string[];

  // Title variants
  subtitle?: string;
  full_title?: string;

  // Physical/digital details (more in detailed responses) - unique to detailed edition where present
  number_of_pages?: number;
  physical_format?: string;
  covers?: number[];
  languages?: Array<{ key: string }>;  // Unique to editions array

  // Content classification (more in summary responses) - unique to editions array where present
  subjects?: string[];

  // Notes and misc - unique to detailed edition where present
  notes?: { type: string; value: string };

  // Versioning metadata
  latest_revision?: number;
  revision?: number;
  created?: { type: string; value: string };
  last_modified?: { type: string; value: string };
}
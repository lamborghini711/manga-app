import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import MangaBanner from '~/components/shared/Banner';
import ColumnSection from '~/components/shared/ColumnSection';
import Section from '~/components/shared/Section';
import SectionSwiper from '~/components/shared/SectionSwiper';
import { REVALIDATE_TIME } from '~/constants';
import RepositoryFactory from '~/services/repositoryFactory';
import { Manga } from '~/types';

const NtApi = RepositoryFactory('nettruyen');

interface HomeProps {
    topMonthList: Manga[];
    newMangaUpdated: Manga[];
    topAllManga: Manga[];
    topMonthManga: Manga[];
    topWeekManga: Manga[];
    topDayManga: Manga[];
    newManga: Manga[];
}

const Home: NextPage<HomeProps> = ({
    topMonthList,
    newMangaUpdated,
    topAllManga,
    topMonthManga,
    topWeekManga,
    topDayManga,
    newManga,
}) => {
    return (
        <div className="flex h-fit min-h-screen flex-col">
            <Head>
                <title>Kyoto Manga</title>
            </Head>

            <MangaBanner mangaList={topMonthList.slice(0, 10)} />

            <Section
                title="Mới cập nhật"
                style="w-[90%] mx-auto w-max-[1300px] mt-6  overflow-x-hidden"
                linkHints={true}
            >
                <SectionSwiper mangaList={newMangaUpdated} />
            </Section>

            <Section style="w-[90%] mx-auto min-w-[333px] w-max-[1300px] mt-6 overflow-x-hidden">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <ColumnSection
                        mangaList={topAllManga.slice(0, 5)}
                        title="Manga nổi bật nhất"
                    />
                    <ColumnSection
                        mangaList={topMonthManga.slice(0, 5)}
                        title="Manga nổi bật tháng"
                    />
                    <ColumnSection
                        mangaList={topWeekManga.slice(0, 5)}
                        title="Manga nổi bật tuần"
                    />
                    <ColumnSection
                        mangaList={topDayManga.slice(0, 5)}
                        title="Manga nổi bật ngày"
                    />
                </div>
            </Section>

            <Section
                title="Truyện mới"
                style="w-[90%] mx-auto w-max-[1300px] mt-6  overflow-x-hidden"
                linkHints={true}
            >
                <SectionSwiper mangaList={newManga} />
            </Section>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const [
        topMonthList,
        newMangaUpdated,
        topAllManga,
        topMonthManga,
        topWeekManga,
        topDayManga,
        newManga,
    ] = await Promise.all([
        NtApi?.filter(1, 'manga-112', 'month').then((res) => res.data.data),
        NtApi?.getNewMangaUpdated(1).then((res) => res.data.data),
        NtApi?.getRankingmanga(undefined, 'all', 1, 'manga-112').then(
            (res) => res.data.data,
        ),
        NtApi?.getRankingmanga(undefined, 'month', 1, 'manga-112').then(
            (res) => res.data.data,
        ),
        NtApi?.getRankingmanga(undefined, 'week', 1, 'manga-112').then(
            (res) => res.data.data,
        ),
        NtApi?.getRankingmanga(undefined, 'day', 1, 'manga-112').then(
            (res) => res.data.data,
        ),
        NtApi?.getNewManga(1).then((res) => res.data.data),
    ]);

    return {
        props: {
            topMonthList,
            newMangaUpdated,
            topAllManga,
            topMonthManga,
            topWeekManga,
            topDayManga,
            newManga,
        },
        revalidate: REVALIDATE_TIME,
    };
};

export default Home;

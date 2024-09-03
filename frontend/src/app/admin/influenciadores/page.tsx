import { CreateInfluencerButton } from './components/create-btn';
import InfluencersTable from './components/table';

export default function InfluenciadoresPage() {
  return (
    <>
      <div className="relative mx-auto mb-4 flex w-fit items-center gap-4 px-4">
        <h2 className="text-2xl sm:text-3xl">Influenciadores</h2>
        <CreateInfluencerButton />
      </div>
      <InfluencersTable />
    </>
  );
}

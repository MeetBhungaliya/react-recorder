import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useStreamStore from '@/hooks/useStream';

const Sidebar = () => {
  const audio = useStreamStore((state) => state.audio);
  const toggleAudio = useStreamStore((state) => state.toggleAudio);

  return (
    <aside className="w-[280px] min-w-[280px] bg-gray-200 shadow-md relative">
      <div className="absolute w-full top-1/4 left-0">
        <div className="px-4 py-2 flex justify-between items-center">
          <Label htmlFor="audio-toggle-switch" className="font-semibold text-xl cursor-pointer">
            Audio
          </Label>
          <Switch
            id="audio-toggle-switch"
            className="data-[state=checked]:!bg-blue-500 !bg-gray-400"
            checked={audio}
            onCheckedChange={toggleAudio}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
